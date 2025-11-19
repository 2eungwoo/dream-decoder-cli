export interface RelatedSymbol {
  symbol: string;
  categories: string[];
  description: string | null;
  emotions: string[];
  mbtiTone: Record<string, string>;
  interpretations: string[];
  advice: string | null;
}
