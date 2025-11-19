import { DataSource } from 'typeorm';
import { RelatedSymbol } from '../types/related-symbol.type';
export declare class DreamSymbolRepository {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    findNearestByEmbedding(vector: number[], limit: number): Promise<RelatedSymbol[]>;
    private normalizeArray;
    private normalizeObject;
}
