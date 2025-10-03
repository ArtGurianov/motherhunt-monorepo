import { getInvitationDetails } from "@/data/getInvitationDetails";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";
import { APIError } from "better-auth/api";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ invitationId: string }> }
) {
  try {
    const { invitationId } = await params;
    const invitationDetails = await getInvitationDetails(invitationId);
    return Response.json(invitationDetails);
  } catch (error) {
    throw error instanceof APIError || error instanceof AppClientError
      ? error
      : new APIError("INTERNAL_SERVER_ERROR", {
          message: "A server error has occured",
        });
  }
}
