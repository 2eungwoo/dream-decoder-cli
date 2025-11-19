"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbeddingInputFactory = void 0;
const common_1 = require("@nestjs/common");
let EmbeddingInputFactory = class EmbeddingInputFactory {
    createFromRequest(body) {
        const lines = [
            this.formatLine('Dream', body.dream),
            this.formatLine('Emotions', body.emotions),
            this.formatLine('MBTI', body.mbti),
            this.formatLine('Context', body.extraContext),
        ].filter((line) => Boolean(line));
        return lines.join('\n');
    }
    formatLine(label, value) {
        if (value == null)
            return null;
        if (Array.isArray(value)) {
            return value.length > 0 ? `${label}: ${value.join(', ')}` : null;
        }
        const trimmed = value.trim();
        return trimmed ? `${label}: ${trimmed}` : null;
    }
};
exports.EmbeddingInputFactory = EmbeddingInputFactory;
exports.EmbeddingInputFactory = EmbeddingInputFactory = __decorate([
    (0, common_1.Injectable)()
], EmbeddingInputFactory);
//# sourceMappingURL=embedding-input.factory.js.map