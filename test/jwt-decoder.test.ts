import { describe, it, expect } from "vitest";
import { decodeJwt } from "@/lib/tools/jwt-decoder/calculations";

// The well-known example token from jwt.io's own default example — a
// widely-published, stable reference value.
const REFERENCE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

describe("decodeJwt", () => {
  it("correctly decodes the well-known jwt.io reference token", () => {
    const result = decodeJwt(REFERENCE_JWT);
    const header = JSON.parse(result.header);
    const payload = JSON.parse(result.payload);
    expect(header).toEqual({ alg: "HS256", typ: "JWT" });
    expect(payload).toEqual({ sub: "1234567890", name: "John Doe", iat: 1516239022 });
    expect(result.signature).toBe("SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
  });

  it("throws a clear error for a token that doesn't have 3 parts", () => {
    expect(() => decodeJwt("not.a.valid.jwt.with.too.many.parts")).toThrow();
    expect(() => decodeJwt("onlyonepart")).toThrow();
  });

  it("reports isExpired correctly based on the exp claim", () => {
    // exp far in the past
    const expiredPayload = Buffer.from(JSON.stringify({ exp: 1000000000 })).toString("base64url");
    const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
    const expiredToken = `${header}.${expiredPayload}.sig`;
    expect(decodeJwt(expiredToken).isExpired).toBe(true);

    // exp far in the future
    const futurePayload = Buffer.from(JSON.stringify({ exp: 9999999999 })).toString("base64url");
    const futureToken = `${header}.${futurePayload}.sig`;
    expect(decodeJwt(futureToken).isExpired).toBe(false);
  });

  it("returns null for isExpired when there is no exp claim", () => {
    const payload = Buffer.from(JSON.stringify({ sub: "123" })).toString("base64url");
    const header = Buffer.from(JSON.stringify({ alg: "none" })).toString("base64url");
    const token = `${header}.${payload}.sig`;
    expect(decodeJwt(token).isExpired).toBeNull();
  });
});
