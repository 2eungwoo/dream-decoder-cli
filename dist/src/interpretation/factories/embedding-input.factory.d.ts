import { InterpretDreamRequestDto } from '../dto/interpret-dream-request.dto';
export declare class EmbeddingInputFactory {
    createFromRequest(body: InterpretDreamRequestDto): string;
    private formatLine;
}
