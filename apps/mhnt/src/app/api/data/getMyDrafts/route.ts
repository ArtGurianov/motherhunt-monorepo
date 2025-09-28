import { getMyDrafts } from "@/data/getMyDrafts";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";
import { APIError } from "better-auth/api";

export async function GET(_: Request) {
  try {
    const drafts = await getMyDrafts();
    return Response.json(drafts);
  } catch (error) {
    throw error instanceof APIError || error instanceof AppClientError
      ? error
      : new APIError("INTERNAL_SERVER_ERROR", {
          message: "A server error has occured",
        });
  }
}
