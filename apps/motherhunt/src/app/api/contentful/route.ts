import {
  CONTENT_TYPE_IDS_LIST,
  ContentTypeId,
  CONTENTFUL_WEBHOOK_CONFIG,
} from "@/config/contentful/webhookConfig";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const body = await request.json();
  const contentType = body?.sys?.contentType?.sys?.id;
  if (!contentType) {
    return Response.json({
      revalidated: false,
      now: Date.now(),
      message:
        "Failed at parsing Contentful contentType from webhook rebuild call.",
    });
  }

  if (!CONTENT_TYPE_IDS_LIST.includes(contentType)) {
    return Response.json({
      revalidated: false,
      now: Date.now(),
      message: `Unrecognized Contentful contentType: ${contentType}`,
    });
  }

  for (const { path, type } of CONTENTFUL_WEBHOOK_CONFIG[
    contentType as ContentTypeId
  ]) {
    revalidatePath(path, type);
  }

  return Response.json({ revalidated: true, now: Date.now() });
}
