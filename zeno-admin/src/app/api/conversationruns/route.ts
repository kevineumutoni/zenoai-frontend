
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BASE_URL;

export async function POST(req: NextRequest) {
  try {
    const { conversationId, userInput } = await req.json();
    const token = req.headers.get("authorization");

    const res = await fetch(`${BASE_URL}/runs/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
      body: JSON.stringify({
        conversation_id: conversationId ?? null,
        user_input: userInput,
      }),
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (!res.ok) {
      throw new Error(data?.detail || data?.message || "Failed to create run");
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
