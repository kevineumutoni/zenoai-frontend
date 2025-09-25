import { NextRequest, NextResponse } from "next/server";
const BASE_URL = process.env.BASE_URL;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = req.headers.get("authorization");

    if (!token) {
      return NextResponse.json(
        { message: "Missing authorization token" },
        { status: 401 }
      );
    }

    const res = await fetch(`${BASE_URL}/reviews/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        review_text: body.review_text ?? "",
        rating: body.rating,
        user: body.user,
      }),
    });

    let data: any = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (!res.ok) {
      console.error("Backend feedback error:", data);
      return NextResponse.json(
        { message: data.detail || data || "Failed to submit feedback" },
        { status: res.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("API feedback route error:", err);
    return NextResponse.json(
      { message: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
