import { NormalizedSymbolBlock } from "./interpretation-symbol-normalizer";

export class InterpretationSymbolFormatter {
  public format(block: NormalizedSymbolBlock): string {
    const lines = [
      `Archetype: ${block.archetypeName} (${block.archetypeId})`,
      `Symbol: ${block.symbol}`,
      this.optionalLine("Action", block.action),
      this.optionalLine(
        "Symbol Meanings",
        this.joinList(block.symbolMeanings)
      ),
      this.formatList("Derived Meanings", block.derivedMeanings),
      this.optionalLine("Advice", block.advice),
    ];

    return lines.filter(Boolean).join("\n");
  }

  private optionalLine(label: string, value?: string | null): string | null {
    if (!value || !value.trim()) return null;
    return `${label}: ${value.trim()}`;
  }

  private joinList(values?: string[]) {
    if (!values?.length) return null;
    return values.join(", ");
  }

  private formatList(label: string, values?: string[]) {
    if (!values?.length) return null;
    const entries = values.map((line) => `- ${line}`).join("\n");
    return `${label}:\n${entries}`;
  }
}
