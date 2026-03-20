import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.NBA_API_KEY;
const BASE_URL = "https://api.balldontlie.io/v1";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const endpoint = searchParams.get("endpoint") ?? "games";

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
