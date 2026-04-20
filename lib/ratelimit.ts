import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

function makeLimit(requests: number, prefix: string): Ratelimit | null {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, "1 m"),
    analytics: true,
    prefix,
  });
}

// 60 req/min — public browsing endpoints
export const standardLimit = makeLimit(60, "corestack:standard");

// 10 req/min — auth-gated mutation endpoints
export const strictLimit = makeLimit(10, "corestack:strict");

// 100 req/min — webhook ingestion (Make.com / Theirstack bulk batches)
export const webhookLimit = makeLimit(100, "corestack:webhook");

export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<NextResponse | null> {
  if (!limiter) return null;

  const { success, limit, remaining, reset } = await limiter.limit(identifier);

  if (!success) {
    return new NextResponse("Too many requests", {
      status: 429,
      headers: {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
        "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
      },
    });
  }
  return null;
}
