import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { RelatedSymbol } from '../types/related-symbol.type';

interface DreamSymbolRecord {
  symbol: string;
  categories: string[] | null;
  description: string | null;
  emotions: string[] | null;
  mbti_tone: Record<string, string> | null;
  interpretations: string[] | null;
  advice: string | null;
}

@Injectable()
export class DreamSymbolRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  public async findNearestByEmbedding(
    vector: number[],
    limit: number,
  ): Promise<RelatedSymbol[]> {
    const vectorLiteral = `[${vector.join(',')}]`;
    const rows: DreamSymbolRecord[] = await this.dataSource.query(
      `
        SELECT symbol,
               categories,
               description,
               emotions,
               mbti_tone,
               interpretations,
               advice
        FROM dream_symbols
        ORDER BY embedding <=> $1::vector
        LIMIT $2;
      `,
      [vectorLiteral, limit],
    );

    return rows.map((row) => ({
      symbol: row.symbol,
      categories: this.normalizeArray(row.categories),
      description: row.description,
      emotions: this.normalizeArray(row.emotions),
      mbtiTone: this.normalizeObject(row.mbti_tone),
      interpretations: this.normalizeArray(row.interpretations),
      advice: row.advice,
    }));
  }

  private normalizeArray(value: unknown) {
    if (!value) {
      return [];
    }
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }

  private normalizeObject(value: unknown) {
    if (!value) {
      return {};
    }
    if (typeof value === 'object') {
      return value as Record<string, string>;
    }
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return typeof parsed === 'object' && parsed !== null ? parsed : {};
      } catch {
        return {};
      }
    }
    return {};
  }
}
