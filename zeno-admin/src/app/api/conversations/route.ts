import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BASE_URL;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    const token = req.headers.get("authorization");

    if (!token) {
      return NextResponse.json({ message: "Missing authorization token" }, { status: 401 });
    }

    const res = await fetch(`${BASE_URL}/conversations/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ user_id: userId }),
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (!res.ok) {
      throw new Error(data?.detail || data?.message || "Failed to create conversation");
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
