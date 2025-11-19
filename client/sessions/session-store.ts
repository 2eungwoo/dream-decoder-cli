export interface SessionData {
  username: string;
  password: string;
}

export class SessionStore {
  private session: SessionData | null = null;

  public set(session: SessionData) {
    this.session = session;
  }

  public clear() {
    this.session = null;
  }

  public get() {
    return this.session;
  }

  public ensureSession() {
    if (!this.session) {
      throw new Error('<!> 로그인이 필요합니다');
    }

    return this.session;
  }
}
