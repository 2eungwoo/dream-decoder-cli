"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const auth_validator_1 = require("../auth/auth.validator");
const password_service_1 = require("../auth/password.service");
const user_entity_1 = require("../users/user.entity");
const openai_client_1 = require("../external/openai/openai.client");
const chat_validator_1 = require("./chat.validator");
let ChatService = class ChatService {
    authValidator;
    chatValidator;
    passwordService;
    openAIClient;
    usersRepository;
    constructor(authValidator, chatValidator, passwordService, openAIClient, usersRepository) {
        this.authValidator = authValidator;
        this.chatValidator = chatValidator;
        this.passwordService = passwordService;
        this.openAIClient = openAIClient;
        this.usersRepository = usersRepository;
    }
    async sendMessage(username, password, message) {
        const { username: normalizedUsername, password: safePassword } = this.authValidator.ensureCredentials(username, password);
        const trimmedMessage = message.trim();
        this.chatValidator.ensureMessage(trimmedMessage);
        const user = this.authValidator.ensureUserExists(await this.usersRepository.findOne({
            where: { username: normalizedUsername },
        }));
        this.authValidator.ensurePasswordValid(this.passwordService.verify(safePassword, user.passwordHash));
        this.authValidator.ensureUserLoggedIn(user.isLoggedIn);
        const reply = await this.openAIClient.generateReply(trimmedMessage);
        return { reply };
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [auth_validator_1.AuthValidator,
        chat_validator_1.ChatValidator,
        password_service_1.PasswordService,
        openai_client_1.OpenAIClient,
        typeorm_2.Repository])
], ChatService);
//# sourceMappingURL=chat.service.js.map