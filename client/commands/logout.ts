import { postApi } from "../api";
import { printResponse } from "../ui/output";
import { SessionStore } from "../sessions/session-store";

export async function handleLogout(args: string[], sessions: SessionStore) {
  let [username, password] = args;
  if (!username || !password) {
    const session = sessions.get();
    if (!session) {
      console.log("Usage: /logout <username> <password> (or login first)");
      return;
    }
    ({ username, password } = session);
  }

  const data = await postApi<{ message: string }>("/auth/logout", {
    username,
    password,
  });
  printResponse(data);

  if (data.success) {
    sessions.clear();
  }
}
