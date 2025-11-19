"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DreamSymbolRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let DreamSymbolRepository = class DreamSymbolRepository {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async findNearestByEmbedding(vector, limit) {
        const vectorLiteral = `[${vector.join(',')}]`;
        const rows = await this.dataSource.query(`
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
      `, [vectorLiteral, limit]);
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
    normalizeArray(value) {
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
            }
            catch {
                return [];
            }
        }
        return [];
    }
    normalizeObject(value) {
        if (!value) {
            return {};
        }
        if (typeof value === 'object') {
            return value;
        }
        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value);
                return typeof parsed === 'object' && parsed !== null ? parsed : {};
            }
            catch {
                return {};
            }
        }
        return {};
    }
};
exports.DreamSymbolRepository = DreamSymbolRepository;
exports.DreamSymbolRepository = DreamSymbolRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], DreamSymbolRepository);
//# sourceMappingURL=dream-symbol.repository.js.map