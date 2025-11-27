import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class InterpretationStreamLogService {
  private readonly logger = new Logger("InterpretationStream");

  public info(component: string, message: string) {
    this.logger.log(this.format(component, message));
  }

  public warn(component: string, message: string) {
    this.logger.warn(this.format(component, message));
  }

  public error(component: string, message: string) {
    this.logger.error(this.format(component, message));
  }

  public debug(component: string, message: string) {
    this.logger.debug(this.format(component, message));
  }

  private format(component: string, message: string) {
    return `[Stream:${component}] ${message}`;
  }
}
