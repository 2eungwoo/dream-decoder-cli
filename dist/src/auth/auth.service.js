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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const auth_validator_1 = require("./auth.validator");
const password_service_1 = require("./password.service");
const api_response_dto_1 = require("../shared/dto/api-response.dto");
let AuthService = class AuthService {
    validator;
    passwordService;
    usersRepository;
    constructor(validator, passwordService, usersRepository) {
        this.validator = validator;
        this.passwordService = passwordService;
        this.usersRepository = usersRepository;
    }
    async register(request) {
        const { username: normalizedUsername, password: safePassword } = this.validator.ensureCredentials(request.username, request.password);
        const existingUser = await this.usersRepository.findOne({
            where: { username: normalizedUsername },
        });
        this.validator.ensureUsernameAvailable(Boolean(existingUser), normalizedUsername);
        const user = this.usersRepository.create({
            username: normalizedUsername,
            passwordHash: this.passwordService.hash(safePassword),
            isLoggedIn: false,
        });
        await this.usersRepository.save(user);
        return api_response_dto_1.ApiResponseFactory.success(undefined, `${request.username}님 환영합니다. 회원가입 성공했습니다.`);
    }
    async login(request) {
        const { username: normalizedUsername, password: safePassword } = this.validator.ensureCredentials(request.username, request.password);
        const user = this.validator.ensureUserExists(await this.usersRepository.findOne({
            where: { username: normalizedUsername },
        }));
        this.validator.ensurePasswordValid(this.passwordService.verify(safePassword, user.passwordHash));
        user.isLoggedIn = true;
        await this.usersRepository.save(user);
        return api_response_dto_1.ApiResponseFactory.success(undefined, `안녕하세요! ${request.username}님`);
    }
    async logout(request) {
        const { username: normalizedUsername, password: safePassword } = this.validator.ensureCredentials(request.username, request.password);
        const user = this.validator.ensureUserExists(await this.usersRepository.findOne({
            where: { username: normalizedUsername },
        }));
        this.validator.ensurePasswordValid(this.passwordService.verify(safePassword, user.passwordHash));
        this.validator.ensureUserLoggedIn(user.isLoggedIn);
        user.isLoggedIn = false;
        await this.usersRepository.save(user);
        return api_response_dto_1.ApiResponseFactory.success(undefined, `안녕히가세요! ${request.username}님`);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [auth_validator_1.AuthValidator,
        password_service_1.PasswordService,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map