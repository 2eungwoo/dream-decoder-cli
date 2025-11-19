"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
let PasswordService = class PasswordService {
    hash(password) {
        const salt = (0, node_crypto_1.randomBytes)(16).toString('hex');
        const derived = (0, node_crypto_1.scryptSync)(password, salt, 32).toString('hex');
        return `${salt}:${derived}`;
    }
    verify(password, storedHash) {
        const [salt, hash] = storedHash.split(':');
        if (!salt || !hash) {
            return false;
        }
        const derived = (0, node_crypto_1.scryptSync)(password, salt, 32);
        const existing = Buffer.from(hash, 'hex');
        return (derived.length === existing.length && (0, node_crypto_1.timingSafeEqual)(derived, existing));
    }
};
exports.PasswordService = PasswordService;
exports.PasswordService = PasswordService = __decorate([
    (0, common_1.Injectable)()
], PasswordService);
//# sourceMappingURL=password.service.js.map