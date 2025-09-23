import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BASE_URL;

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization");
    const { searchParams } = new URL(req.url);
    const runId = searchParams.get("id");

    if (!runId) {
      return NextResponse.json({ message: "Missing runId parameter" }, { status: 400 });
    }

    const res = await fetch(`${BASE_URL}/runs/${runId}/`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (!res.ok) {
      throw new Error(data?.detail || data?.message || "Failed to fetch run");
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
