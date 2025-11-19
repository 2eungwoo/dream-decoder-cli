import { Injectable } from '@nestjs/common';
import { InterpretDreamRequestDto } from '../dto/interpret-dream-request.dto';

@Injectable()
export class EmbeddingInputFactory {
  public createFromRequest(body: InterpretDreamRequestDto) {
    const lines = [
      this.formatLine('Dream', body.dream),
      this.formatLine('Emotions', body.emotions),
      this.formatLine('MBTI', body.mbti),
      this.formatLine('Context', body.extraContext),
    ].filter((line): line is string => Boolean(line));

    return lines.join('\n');
  }

  /*
    - string 또는 string[] 모두 처리 
	  -	trim 처리
    - 빈 배열 혹은 빈 문자열 automatic skip
	  -	null/undefined 자동 skip
  */
  private formatLine(label: string, value?: string | string[]): string | null {
    if (value == null) return null;

    if (Array.isArray(value)) {
      return value.length > 0 ? `${label}: ${value.join(', ')}` : null;
    }

    const trimmed = value.trim();
    return trimmed ? `${label}: ${trimmed}` : null;
  }
}
