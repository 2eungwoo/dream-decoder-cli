import { postApi } from '../api';
import { printResponse } from '../ui/output';
import { SessionStore } from '../sessions/session-store';

export async function handleLogin(args: string[], sessions: SessionStore) {
  const [username, password] = args;
  if (!username || !password) {
    console.log('Usage: login <username> <password>');
    return;
  }

  const data = await postApi<{ message: string }>('/auth/login', {
    username,
    password,
  });
  printResponse(data);

  if (data.success) {
    sessions.set({ username, password });
  }
}
