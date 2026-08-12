import assert from "node:assert/strict";
import { describe, it } from "node:test";

const locales = ["pl", "en"];

function isAuthCallbackPath(pathname) {
  return (
    pathname === "/auth/callback" || pathname.startsWith("/auth/callback/")
  );
}

function stripLocalePrefix(pathname) {
  for (const locale of locales) {
    if (pathname === `/${locale}` || pathname === `/${locale}/`) {
      return "/";
    }
    const prefix = `/${locale}/`;
    if (pathname.startsWith(prefix)) {
      return `/${pathname.slice(prefix.length)}`;
    }
  }
  return pathname;
}

function hasSupabaseAuthCookie(cookies) {
  return cookies.some(
    (cookie) =>
      cookie.name.startsWith("sb-") && cookie.name.includes("auth-token"),
  );
}

function classifyMiddlewareRoute(pathname) {
  if (isAuthCallbackPath(pathname)) return "callback";
  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) {
    return "protected";
  }
  const path = stripLocalePrefix(pathname);
  if (
    path.startsWith("/my-events") ||
    path.startsWith("/my-academies") ||
    path === "/login" ||
    path.startsWith("/login/") ||
    path === "/register" ||
    path.startsWith("/register/")
  ) {
    return "public-auth-aware";
  }
  return "public";
}

function shouldUpdateSession({ pathname, hasAuthCookie }) {
  const routeClass = classifyMiddlewareRoute(pathname);
  if (routeClass === "callback") return false;
  if (routeClass === "protected") return true;
  if (routeClass === "public-auth-aware") return true;
  return hasAuthCookie;
}

const cases = [
  { pathname: "/pl", hasAuthCookie: false, expect: false, label: "anon home" },
  {
    pathname: "/en/event/x",
    hasAuthCookie: false,
    expect: false,
    label: "anon event",
  },
  {
    pathname: "/pl/academies",
    hasAuthCookie: false,
    expect: false,
    label: "anon academies",
  },
  {
    pathname: "/pl",
    hasAuthCookie: true,
    expect: true,
    label: "logged-in home",
  },
  {
    pathname: "/admin",
    hasAuthCookie: false,
    expect: true,
    label: "admin always",
  },
  {
    pathname: "/pl/my-events",
    hasAuthCookie: false,
    expect: true,
    label: "my-events auth-aware",
  },
  {
    pathname: "/en/login",
    hasAuthCookie: false,
    expect: true,
    label: "login auth-aware",
  },
  {
    pathname: "/auth/callback",
    hasAuthCookie: true,
    expect: false,
    label: "callback never",
  },
];

describe("shouldUpdateSession", () => {
  for (const row of cases) {
    it(row.label, () => {
      assert.equal(
        shouldUpdateSession({
          pathname: row.pathname,
          hasAuthCookie: row.hasAuthCookie,
        }),
        row.expect,
      );
    });
  }
});

describe("hasSupabaseAuthCookie", () => {
  it("detects chunked auth token cookies", () => {
    assert.equal(
      hasSupabaseAuthCookie([
        { name: "sb-abc-auth-token.0" },
        { name: "other" },
      ]),
      true,
    );
    assert.equal(hasSupabaseAuthCookie([{ name: "session" }]), false);
  });
});

describe("classifyMiddlewareRoute", () => {
  it("classifies core paths", () => {
    assert.equal(classifyMiddlewareRoute("/auth/callback"), "callback");
    assert.equal(classifyMiddlewareRoute("/admin/edit/1"), "protected");
    assert.equal(classifyMiddlewareRoute("/pl/my-events"), "public-auth-aware");
    assert.equal(classifyMiddlewareRoute("/en/event/foo"), "public");
  });
});
