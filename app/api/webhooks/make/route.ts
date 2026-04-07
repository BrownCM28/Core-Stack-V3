// Alias — Make.com points here; delegates to the shared ingest handler.
import { handleIngest } from "@/lib/ingest-handler";

export async function POST(req: Request) {
  return handleIngest(req);
}
