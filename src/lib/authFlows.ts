export type BasicRegistrationInput = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  captchaToken: string;
};

export function createBasicRegistrationPayload(input: BasicRegistrationInput) {
  return {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    password: input.password,
    confirmPassword: input.confirmPassword,
    captchaToken: input.captchaToken,
  };
}

export function getPostLoginDestination(state: unknown): string {
  const pathname = (state as { from?: { pathname?: unknown } } | null)?.from?.pathname;
  return typeof pathname === "string" && pathname.startsWith("/") ? pathname : "/";
}
