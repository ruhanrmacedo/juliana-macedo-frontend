export interface PasswordResetLocationSnapshot {
  hash: string;
  pathname: string;
  search: string;
}

export interface PasswordResetHistory {
  state: unknown;
  replaceState(data: unknown, unused: string, url?: string | URL | null): void;
}

export interface CapturedPasswordResetToken {
  token: string;
  cleanUrl: string | null;
}

export function capturePasswordResetToken(
  location: PasswordResetLocationSnapshot
): CapturedPasswordResetToken {
  const fragment = location.hash.startsWith("#")
    ? location.hash.slice(1)
    : location.hash;
  const fragmentParams = new URLSearchParams(fragment);

  if (!fragmentParams.has("token")) {
    return { token: "", cleanUrl: null };
  }

  return {
    token: fragmentParams.get("token")?.trim() ?? "",
    cleanUrl: `${location.pathname}${location.search}`,
  };
}

export function clearPasswordResetFragment(
  history: PasswordResetHistory,
  cleanUrl: string | null
): void {
  if (!cleanUrl) return;
  history.replaceState(history.state, "", cleanUrl);
}
