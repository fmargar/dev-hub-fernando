import { NextRequest, NextResponse } from "next/server";
import { clientIp, createRateLimiter } from "@/lib/api-guard";

const API_KEY = process.env.NBA_API_KEY;
const BASE_URL = "https://api.balldontlie.io/v1";

// Solo lo que usa la herramienta: sin lista, ?endpoint= reenviaba cualquier
// ruta de la API externa con nuestra clave.
const ALLOWED_ENDPOINTS = new Set(["games", "teams", "players"]);

const isRateLimited = createRateLimiter({
  ipMax: 60,
  ipWindowMs: 60 * 1000,
  globalMax: 600,
  globalWindowMs: 60 * 60 * 1000,
});

export async function GET(req: NextRequest) {
    if (isRateLimited(clientIp(req))) {
        return NextResponse.json({ error: "Demasiadas peticiones" }, { status: 429 });
    }
    if (!API_KEY) {
        return NextResponse.json(
            { error: "NBA API Key no configurada" },
            { status: 500 }
        );
    }

    const { searchParams } = new URL(req.url);
    const endpoint = searchParams.get("endpoint") ?? "games";
    if (!ALLOWED_ENDPOINTS.has(endpoint)) {
        return NextResponse.json({ error: "Endpoint no permitido" }, { status: 400 });
    }

    // Build query string forwarding all params except "endpoint"
    const forward = new URLSearchParams();
    searchParams.forEach((value, key) => {
        if (key !== "endpoint") forward.append(key, value);
    });

    const url = `${BASE_URL}/${endpoint}${forward.toString() ? `?${forward}` : ""}`;

    try {
        const res = await fetch(url, {
            headers: { Authorization: API_KEY },
            next: { revalidate: 30 }, // cache 30s
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: `Upstream error ${res.status}` },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data, {
            headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=60" },
        });
    } catch {
        return NextResponse.json({ error: "Failed to reach balldontlie API" }, { status: 502 });
    }
}
