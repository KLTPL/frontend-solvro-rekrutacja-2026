// The API data is in English – category names are translated for the UI,
// unknown values fall back to the original text.
const categoryLabels: Record<string, string> = {
  Cocktail: "Koktajl",
  "Ordinary Drink": "Klasyczny drink",
  "Punch / Party Drink": "Poncz i imprezowe",
  Shake: "Shake",
  "Other / Unknown": "Inne",
  Cocoa: "Kakao",
  Shot: "Shot",
  "Coffee / Tea": "Kawa i herbata",
  "Homemade Liqueur": "Domowy likier",
  "Soft Drink": "Napój",
};

export function categoryLabel(category: string): string {
  return categoryLabels[category] ?? category;
}

export function alcoholLabel(alcoholic: boolean): string {
  return alcoholic ? "Alkoholowy" : "Bezalkoholowy";
}
