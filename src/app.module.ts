import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { ChatModule } from "./chat/chat.module";
import { User } from "./users/user.entity";
import { InterpretationModule } from "./interpretation/interpretation.module";
import { openAIConfig } from "./external/openai/openai.config";
import { RedisModule } from "./infra/redis/redis.module";
import { InterpretationRecord } from "./interpretation-records/interpretation-record.entity";
import { InterpretationRecordModule } from "./interpretation-records/interpretation-record.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [openAIConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("DB_HOST", "localhost"),
        port: Number(configService.get<string>("DB_PORT", "5432")),
        username: configService.get<string>("DB_USER", "postgres"),
        password: configService.get<string>("DB_PASSWORD", "postgres"),
        database: configService.get<string>("DB_NAME", "dream_decoder"),
        entities: [User, InterpretationRecord],
        synchronize: true,
      }),
    }),
    AuthModule,
    ChatModule,
    InterpretationModule,
    InterpretationRecordModule,
    RedisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
