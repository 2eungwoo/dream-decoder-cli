"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const api_response_interceptor_1 = require("./shared/interceptors/api-response.interceptor");
const http_exception_filter_1 = require("./shared/filters/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
    }));
    app.useGlobalInterceptors(new api_response_interceptor_1.ApiResponseInterceptor());
    app.useGlobalFilters(new http_exception_filter_1.GlobalHttpExceptionFilter());
    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
//# sourceMappingURL=main.js.map