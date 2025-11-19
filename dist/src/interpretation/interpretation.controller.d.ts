import type { InterpretDreamRequestDto } from './dto/interpret-dream-request.dto';
import { InterpretationService } from './interpretation.service';
export declare class InterpretationController {
    private readonly interpretationService;
    constructor(interpretationService: InterpretationService);
    interpret(body: InterpretDreamRequestDto): Promise<import("../shared/dto/api-response.dto").ApiSuccessResponse<{
        interpretation: string;
        references: import("./types/related-symbol.type").RelatedSymbol[];
    }>>;
}
