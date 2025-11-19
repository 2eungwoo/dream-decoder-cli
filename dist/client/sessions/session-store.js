"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionStore = void 0;
class SessionStore {
    session = null;
    set(session) {
        this.session = session;
    }
    clear() {
        this.session = null;
    }
    get() {
        return this.session;
    }
    ensureSession() {
        if (!this.session) {
            throw new Error('<!> 로그인이 필요합니다');
        }
        return this.session;
    }
}
exports.SessionStore = SessionStore;
//# sourceMappingURL=session-store.js.map