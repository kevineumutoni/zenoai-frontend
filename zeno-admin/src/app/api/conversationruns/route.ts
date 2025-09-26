import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BASE_URL;

export async function POST(req: NextRequest) {
  try {
    if (!BASE_URL) {
      console.error("BASE_URL is not configured");
      return NextResponse.json(
        { message: "Server misconfiguration" },
        { status: 500 }
      );
    }

    const contentType = req.headers.get("content-type") || "";
    const token = req.headers.get("authorization");

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const conversationId = formData.get("conversationId");
      const userInput = formData.get("userInput")?.toString() || "(file upload)";
      const files = formData.getAll("files").filter(file => file instanceof File);

      if (files.length === 0) {
        return NextResponse.json(
          { message: "No valid files provided" },
          { status: 400 }
        );
      }

      const backendForm = new FormData();
      backendForm.append("user_input", userInput);
      backendForm.append("conversation_id", conversationId ? String(conversationId) : "");
      files.forEach(file => backendForm.append("files", file));

      const res = await fetch(`${BASE_URL}/runs/`, {
        method: "POST",
        headers: token ? { Authorization: token } : {},
        body: backendForm,
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
      }

      if (!res.ok) {
        const errorMessage = data?.detail || data?.message || `Backend error ${res.status}`;
        console.error("[conversationruns] Backend error:", errorMessage);
        return NextResponse.json({ message: errorMessage }, { status: res.status });
      }

      return NextResponse.json(data, { status: 201 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { conversationId, userInput } = body;

    if (typeof userInput !== 'string') {
      return NextResponse.json(
        { message: "userInput must be a string" },
        { status: 400 }
      );
    }

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

    let data: any = {};
    try {
      data = await res.json();
    } catch {
    }

    if (!res.ok) {
      const errorMessage = data?.detail || data?.message || `Backend error ${res.status}`;
      console.error("[conversationruns] Backend error:", errorMessage);
      return NextResponse.json({ message: errorMessage }, { status: res.status });
    }

    return NextResponse.json(data, { status: 201 });

  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[conversationruns API] Unexpected error:", message);
    return NextResponse.json({ message }, { status: 500 });
  }
}