import { handleIngest } from "@/lib/ingest-handler";
import { checkRateLimit, webhookLimit } from "@/lib/ratelimit";

export async function POST(req: Request) {
  const rl = await checkRateLimit(webhookLimit, "webhook");
  if (rl) return rl;
  return handleIngest(req);
}
