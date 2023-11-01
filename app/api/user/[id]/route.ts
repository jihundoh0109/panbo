import { NotFoundError, ServerError } from "@/lib/errors";
import { getUserByIdService } from "@/server/service/user";

export async function GET(request: Request) {
  try {
    const userId = request.url.split("/")[5];
    const user = await getUserByIdService(userId);
    return new Response(JSON.stringify(user), {
      status: 200,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return new Response(error.message, {
        status: 404,
      });
    } else {
      const errorMessage =
        (error as ServerError).message || (error as Error).toString();
      return new Response(errorMessage, {
        status: 500,
      });
    }
  }
}
