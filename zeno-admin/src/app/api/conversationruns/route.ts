import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BASE_URL;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ message: "Authorization header is required" }, { status: 401 });
  }

  if (!BASE_URL) {
    return NextResponse.json({ message: "Backend URL is not configured" }, { status: 500 });
  }

  try {
    const backendRes = await fetch(`${BASE_URL}/conversations/with_runs/`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
      },
    });

    const data = await backendRes.json().catch(() => ({}));

    if (!backendRes.ok) {
      throw new Error(data?.detail || data?.message || "Failed to fetch conversations with runs");
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}