import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BASE_URL;

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization"); 
    const { searchParams } = new URL(req.url);
    const runId = searchParams.get("id");

    if (!runId) {
      return NextResponse.json(
        { message: "Missing runId parameter" },
        { status: 400 }
      );
    }

    const response = await fetch(`${BASE_URL}/runs/${runId}/`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}), 
      },
    });

    let data: Record<string, unknown> = {};
    try {
      data = await response.json();
    } catch {
      data = { message: "Invalid JSON " };
    }

    if (!response.ok) {
      return NextResponse.json(
        { message: typeof data.detail === "string" ? data.detail : data.message ?? "Failed to fetch run" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}