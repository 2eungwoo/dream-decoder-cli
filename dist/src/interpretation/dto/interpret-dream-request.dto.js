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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterpretDreamRequestDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class InterpretDreamRequestDto {
    dream;
    emotions;
    mbti;
    extraContext;
}
exports.InterpretDreamRequestDto = InterpretDreamRequestDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: '<!> 꿈 내용을 입력해주세요.' }),
    __metadata("design:type", String)
], InterpretDreamRequestDto.prototype, "dream", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], InterpretDreamRequestDto.prototype, "emotions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.toUpperCase() : value),
    (0, class_validator_1.Matches)(/^(?:[EI][SN][TF][JP])$/i, {
        message: '<!> 올바른 MBTI 유형을 입력해주세요.',
    }),
    __metadata("design:type", String)
], InterpretDreamRequestDto.prototype, "mbti", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InterpretDreamRequestDto.prototype, "extraContext", void 0);
//# sourceMappingURL=interpret-dream-request.dto.js.map