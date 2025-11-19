"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidator = void 0;
const common_1 = require("@nestjs/common");
const invalid_credentials_exception_1 = require("./exceptions/invalid-credentials.exception");
const missing_credentials_exception_1 = require("./exceptions/missing-credentials.exception");
const user_not_logged_in_exception_1 = require("./exceptions/user-not-logged-in.exception");
const username_taken_exception_1 = require("./exceptions/username-taken.exception");
let AuthValidator = class AuthValidator {
    ensureCredentials(username, password) {
        const trimmedUsername = username?.trim();
        const trimmedPassword = password?.trim();
        if (!trimmedUsername || !trimmedPassword) {
            throw new missing_credentials_exception_1.MissingCredentialsException();
        }
        return {
            username: trimmedUsername,
            password: password,
        };
    }
    ensureUsernameAvailable(isTaken, username) {
        if (isTaken) {
            throw new username_taken_exception_1.UsernameTakenException(username);
        }
    }
    ensureUserExists(user) {
        if (!user) {
            throw new invalid_credentials_exception_1.InvalidCredentialsException();
        }
        return user;
    }
    ensurePasswordValid(isValid) {
        if (!isValid) {
            throw new invalid_credentials_exception_1.InvalidCredentialsException();
        }
    }
    ensureUserLoggedIn(isLoggedIn) {
        if (!isLoggedIn) {
            throw new user_not_logged_in_exception_1.UserNotLoggedInException();
        }
    }
};
exports.AuthValidator = AuthValidator;
exports.AuthValidator = AuthValidator = __decorate([
    (0, common_1.Injectable)()
], AuthValidator);
//# sourceMappingURL=auth.validator.js.map