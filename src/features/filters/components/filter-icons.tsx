import {
  AmphoraIcon,
  BeerIcon,
  CircleQuestionMarkIcon,
  CoffeeIcon,
  CupSodaIcon,
  DropletIcon,
  GlassWaterIcon,
  IceCreamBowlIcon,
  MartiniIcon,
  MilkIcon,
  PartyPopperIcon,
  WineIcon,
  type LucideIcon,
} from "lucide-react";

// The API has no pictures for these – icons stand in for the ingredient photos.
const categoryIcons: Record<string, LucideIcon> = {
  Cocktail: MartiniIcon,
  "Ordinary Drink": GlassWaterIcon,
  "Punch / Party Drink": PartyPopperIcon,
  Shake: IceCreamBowlIcon,
  "Other / Unknown": CircleQuestionMarkIcon,
  Cocoa: MilkIcon,
  Shot: DropletIcon,
  "Coffee / Tea": CoffeeIcon,
  "Homemade Liqueur": AmphoraIcon,
  "Soft Drink": CupSodaIcon,
};

export function categoryIcon(category: string): LucideIcon {
  return categoryIcons[category] ?? GlassWaterIcon;
}

// There are ~30 glass names (with inconsistent casing) – match them by keyword.
const glassIcons: [RegExp, LucideIcon][] = [
  [/wine|champagne|balloon|snifter|cordial/, WineIcon],
  [/beer|pint|pilsner/, BeerIcon],
  [/mug|cup/, CoffeeIcon],
  [/cocktail|martini|margarita|coupe|nick and nora/, MartiniIcon],
  [/jar|pitcher|bowl/, AmphoraIcon],
];

export function glassIcon(glass: string): LucideIcon {
  const name = glass.toLowerCase();
  return (
    glassIcons.find(([pattern]) => pattern.test(name))?.[1] ?? GlassWaterIcon
  );
}
