"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterpretationPromptBuilder = void 0;
const common_1 = require("@nestjs/common");
let InterpretationPromptBuilder = class InterpretationPromptBuilder {
    buildPrompt(request, symbols) {
        const normalizedMbti = request.mbti?.toUpperCase();
        const formattedSymbols = symbols
            .map((symbol, idx) => this.formatSymbol(symbol, idx, normalizedMbti))
            .filter(Boolean)
            .join('\n\n');
        const parts = [
            `Dream narrative:\n${request.dream.trim()}`,
            this.optionalLine('Dreamer emotions', request.emotions?.join(', ')),
            this.optionalLine('Dreamer MBTI', normalizedMbti),
            this.optionalLine('Additional context', request.extraContext?.trim()),
            'Relevant symbol references:',
            formattedSymbols || 'No prior references found.',
            'Please provide a cohesive interpretation and actionable guidance.',
        ];
        return parts.filter(Boolean).join('\n\n');
    }
    formatSymbol(symbol, index, mbti) {
        const tone = this.resolveTone(symbol, mbti);
        const interpretations = symbol.interpretations?.length
            ? symbol.interpretations.map((line) => `- ${line}`).join('\n')
            : null;
        const lines = [
            `Symbol #${index + 1}: ${symbol.symbol}`,
            this.optionalLine('Categories', symbol.categories?.join(', ')),
            this.optionalLine('Description', symbol.description),
            this.optionalLine('Emotions', symbol.emotions?.join(', ')),
            this.optionalLine('Suggested Tone', tone),
            interpretations ? `Interpretations:\n${interpretations}` : null,
            this.optionalLine('Advice', symbol.advice),
        ];
        return lines.filter(Boolean).join('\n');
    }
    resolveTone(symbol, mbti) {
        if (!symbol.mbtiTone)
            return null;
        if (mbti && symbol.mbtiTone[mbti]) {
            return symbol.mbtiTone[mbti];
        }
        return symbol.mbtiTone.DEFAULT || null;
    }
    optionalLine(label, value) {
        if (!value || !value.trim())
            return null;
        return `${label}: ${value.trim()}`;
    }
};
exports.InterpretationPromptBuilder = InterpretationPromptBuilder;
exports.InterpretationPromptBuilder = InterpretationPromptBuilder = __decorate([
    (0, common_1.Injectable)()
], InterpretationPromptBuilder);
//# sourceMappingURL=interpretation-prompt.builder.js.map