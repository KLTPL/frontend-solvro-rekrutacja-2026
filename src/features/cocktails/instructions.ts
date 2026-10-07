/**
 * Splits free-form instructions into steps – one per sentence.
 * A new step starts only after sentence punctuation followed by a capital
 * letter, so abbreviations like "approx. 2 oz" stay in one piece.
 */
export function splitInstructions(instructions: string): string[] {
  return instructions
    .split(/(?<=[.!?])\s+(?=[A-Z])/)
    .map((step) => step.trim())
    .filter(Boolean);
}
