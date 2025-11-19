import { postApi } from '../api';
import { printResponse } from '../ui/output';

export async function handleRegister(args: string[]) {
  const [username, password] = args;
  if (!username || !password) {
    console.log('Usage: register <username> <password>');
    return;
  }

  const data = await postApi<{ message: string }>('/auth/register', {
    username,
    password,
  });
  printResponse(data);
}
