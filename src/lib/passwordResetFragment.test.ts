import { describe, expect, it, vi } from "vitest";
import {
  capturePasswordResetToken,
  clearPasswordResetFragment,
} from "./passwordResetFragment";

describe("passwordResetFragment", () => {
  it("captura o token do fragmento e mantém o token em memória após limpar a URL", () => {
    const captured = capturePasswordResetToken({
      hash: "#token=token-secreto",
      pathname: "/reset-password",
      search: "",
    });
    let visibleUrl = "/reset-password#token=token-secreto";
    const history = {
      state: null,
      replaceState: vi.fn((_data, _unused, url) => {
        visibleUrl = String(url);
      }),
    };

    clearPasswordResetFragment(history, captured.cleanUrl);

    expect(captured.token).toBe("token-secreto");
    expect(visibleUrl).toBe("/reset-password");
    expect(visibleUrl).not.toContain("token-secreto");
    expect(captured.token).toBe("token-secreto");
    expect(history.replaceState).toHaveBeenCalledWith(
      null,
      "",
      "/reset-password"
    );
  });

  it("não aceita token vindo da query string", () => {
    const captured = capturePasswordResetToken({
      hash: "",
      pathname: "/reset-password",
      search: "?token=query-token",
    });

    expect(captured).toEqual({ token: "", cleanUrl: null });
  });
});
