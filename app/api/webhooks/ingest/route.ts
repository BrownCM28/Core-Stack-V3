import { handleIngest } from "@/lib/ingest-handler";

export async function POST(req: Request) {
  return handleIngest(req);
}
