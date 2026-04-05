// Alias — Make.com points here; delegates to the shared ingest handler.
import { handleIngest } from "@/app/api/webhooks/ingest/route";

export async function POST(req: Request) {
  return handleIngest(req);
}
