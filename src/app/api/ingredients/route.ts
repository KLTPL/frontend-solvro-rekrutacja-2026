import { getUsedIngredients } from "@/features/cocktails/server";

/** Ingredients that appear in at least one cocktail, most popular first. */
export async function GET() {
  return Response.json(await getUsedIngredients());
}
