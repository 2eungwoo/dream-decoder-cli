import { InterpretDreamRequestDto } from '../dto/interpret-dream-request.dto';
import { RelatedSymbol } from '../types/related-symbol.type';
export declare class InterpretationPromptBuilder {
    buildPrompt(request: InterpretDreamRequestDto, symbols: RelatedSymbol[]): string;
    private formatSymbol;
    private resolveTone;
    private optionalLine;
}
