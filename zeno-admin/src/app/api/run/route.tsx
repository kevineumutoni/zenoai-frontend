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

    const backendRes = await fetch(`${BASE_URL}/runs/${runId}/`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}), 
      },
    });

    let data: any = {};
    try {
      data = await backendRes.json();
    } catch {
      data = { message: "Invalid JSON returned by backend" };
    }

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: data?.detail || data?.message || "Failed to fetch run" },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("API /run failed:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
