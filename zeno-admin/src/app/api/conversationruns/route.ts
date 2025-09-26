import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BASE_URL;

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization") || req.headers.get("Authorization");

  if (!token) {
    return NextResponse.json({ message: "Missing authorization token" }, { status: 401 });
  }

  try {
    const backendRes = await fetch(`${BASE_URL}/conversations/with_runs/`, {
      method: "GET",
      headers: {
        Authorization: token,
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