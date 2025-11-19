import { Body, Controller, Post } from '@nestjs/common';
import { InterpretationService } from './interpretation.service';
import { InterpretDreamRequestDto } from './dto/interpret-dream-request.dto';

@Controller('interpret')
export class InterpretationController {
  constructor(private readonly interpretationService: InterpretationService) {}

  @Post()
  public interpret(@Body() payload: InterpretDreamRequestDto) {
    return this.interpretationService.interpret(payload);
  }
}
