import { getFilterOptions } from "@/features/cocktails/server";

/** Ingredients, categories and glasses used by any cocktail, with counts. */
export async function GET() {
  return Response.json(await getFilterOptions());
}
