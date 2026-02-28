import { collectiblesPreview } from "@/data/data";

export async function GET() {
  return Response.json(collectiblesPreview);
}
