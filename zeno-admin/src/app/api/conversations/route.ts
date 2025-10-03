import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BASE_URL;

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ message: "Missing authorization" }, { status: 401 });
  }
  if (!BASE_URL) {
    return NextResponse.json({ message: "Backend not configured" }, { status: 500 });
  }
  try {
    const body = await req.json();
    const { user_id, title } = body;
    const backendRes = await fetch(`${BASE_URL}/conversations/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({ user_id, title: title || "New Chat" }),
    });
    const data = await backendRes.json().catch(() => ({}));
    if (!backendRes.ok) {
      return NextResponse.json(
        data,
        { status: backendRes.status }
      );
    }
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}