import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { InterpretationService } from "./interpretation.service";
import { InterpretDreamRequestDto } from "./dto/interpret-dream-request.dto";
import { InterpretAuthGuard } from "./guards/interpret-auth.guard";

@Controller("interpret")
@UseGuards(InterpretAuthGuard)
export class InterpretationController {
  constructor(private readonly interpretationService: InterpretationService) {}

  @Post()
  public interpret(@Body() payload: InterpretDreamRequestDto) {
    return this.interpretationService.interpret(payload);
  }
}
