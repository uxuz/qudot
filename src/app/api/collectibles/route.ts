import { collectibles } from "@/data/data";

export const dynamic = "force-static";

export async function GET() {
  return Response.json(collectibles);
}
