
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BASE_URL;

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const conversationId = formData.get("conversationId");
      const userInput = formData.get("userInput") || "(file upload)";
      const files = formData.getAll("files");

      const backendForm = new FormData();
      backendForm.append("user_input", String(userInput));
      backendForm.append(
        "conversation_id",
        conversationId ? String(conversationId) : ""
      );
      files.forEach((file) => backendForm.append("files", file));

      const token = req.headers.get("authorization");
      const res = await fetch(`${BASE_URL}/runs/`, {
        method: "POST",
        headers: token ? { Authorization: token } : {},
        body: backendForm,
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        throw new Error(data?.detail || data?.message || "Failed to create run");
      }

      return NextResponse.json(data, { status: 201 });
    }

    // Handle text-only request
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

    let data: any = {};
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
    console.error("[conversationruns API] Error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
