import { getSession } from "@/data/getSession";
import { APIError } from "better-auth/api";

export async function GET(_: Request) {
  try {
    const session = await getSession();
    return Response.json(session);
  } catch (error) {
    throw error instanceof APIError
      ? error
      : new APIError("INTERNAL_SERVER_ERROR", {
          message: "A server error has occured",
        });
  }
}
