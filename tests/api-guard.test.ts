import { describe, expect, it } from "vitest";
import { BodyTooLargeError, createRateLimiter, readBodyLimited } from "@/lib/api-guard";

describe("createRateLimiter", () => {
  it("corta por IP y deja pasar a otra IP", () => {
    let t = 0;
    const limited = createRateLimiter({ ipMax: 2, ipWindowMs: 1000, globalMax: 100, globalWindowMs: 1000 }, () => t);
    expect(limited("a")).toBe(false);
    expect(limited("a")).toBe(false);
    expect(limited("a")).toBe(true);
    expect(limited("b")).toBe(false);
    t = 1500;
    expect(limited("a")).toBe(false);
  });

  it("corta por el tope global aunque cada IP sea distinta", () => {
    const limited = createRateLimiter({ ipMax: 100, ipWindowMs: 1000, globalMax: 3, globalWindowMs: 1000 }, () => 0);
    expect(["1", "2", "3"].map((ip) => limited(ip))).toEqual([false, false, false]);
    expect(limited("4")).toBe(true);
  });
});

describe("readBodyLimited", () => {
  it("rechaza por Content-Length sin leer", async () => {
    const req = new Request("http://x/", { method: "POST", body: "hola", headers: { "content-length": "999999" } });
    await expect(readBodyLimited(req, 10)).rejects.toBeInstanceOf(BodyTooLargeError);
  });

  it("rechaza al pasarse mientras lee aunque no haya Content-Length", async () => {
    const stream = new ReadableStream({
      start(c) {
        c.enqueue(new Uint8Array(8));
        c.enqueue(new Uint8Array(8));
        c.close();
      },
    });
    const req = new Request("http://x/", { method: "POST", body: stream, duplex: "half" } as RequestInit);
    await expect(readBodyLimited(req, 10)).rejects.toBeInstanceOf(BodyTooLargeError);
  });

  it("devuelve el cuerpo si cabe", async () => {
    const req = new Request("http://x/", { method: "POST", body: "hola" });
    expect(new TextDecoder().decode(await readBodyLimited(req, 10))).toBe("hola");
  });
});
