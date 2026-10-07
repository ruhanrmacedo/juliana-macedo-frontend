import { describe, expect, it } from "vitest";
import { resolveRouteAccess } from "./routeAccess";

describe("resolveRouteAccess", () => {
  it("aguarda a validação da sessão antes de decidir", () => {
    expect(resolveRouteAccess({ loading: true, isAuthenticated: false })).toBe("loading");
  });

  it("envia visitante não autenticado para o login", () => {
    expect(resolveRouteAccess({ loading: false, isAuthenticated: false })).toBe("login");
  });

  it("recusa usuário autenticado sem a role exigida", () => {
    expect(resolveRouteAccess({
      loading: false,
      isAuthenticated: true,
      role: "user",
      allowedRoles: ["admin"],
    })).toBe("forbidden");
  });

  it("permite admin em rota administrativa", () => {
    expect(resolveRouteAccess({
      loading: false,
      isAuthenticated: true,
      role: "admin",
      allowedRoles: ["admin"],
    })).toBe("allow");
  });
});