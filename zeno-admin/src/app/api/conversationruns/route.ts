import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BASE_URL;

export async function POST(req: NextRequest) {
  if (!BASE_URL) {
    return NextResponse.json({ message: "Server misconfiguration" }, { status: 500 });
  }

  try {
    const token = req.headers.get("authorization") || "";
    const contentType = req.headers.get("content-type") || "";

    let fetchBody: any;
    let fetchHeaders: Record<string, string> = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const conversationId = formData.get("conversationId")?.toString() ?? "";
      const userInput = formData.get("userInput")?.toString() || "(file upload)";
      const files = formData
        .getAll("files")
        .filter(file => file && typeof (file as any).name === "string");

      if (files.length === 0) {
        return NextResponse.json({ message: "No valid files provided" }, { status: 400 });
      }

      fetchBody = new FormData();
      fetchBody.append("user_input", userInput);
      fetchBody.append("conversation_id", conversationId);
      files.forEach(file => fetchBody.append("files", file));

      if (token) {
        fetchHeaders["Authorization"] = token;
      }
    } else {
      let bodyJson: any;
      try {
        bodyJson = await req.json();
      } catch {
        return NextResponse.json({ message: "Invalid JSON in request body" }, { status: 400 });
      }

      const { conversationId, userInput } = bodyJson;

      if (typeof userInput !== "string") {
        return NextResponse.json({ message: "userInput must be a string" }, { status: 400 });
      }

      fetchBody = JSON.stringify({
        conversation_id: conversationId ?? null,
        user_input: userInput,
      });

      fetchHeaders = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      };
    }

    const response = await fetch(`${BASE_URL}/runs/`, {
      method: "POST",
      headers: fetchHeaders,
      body: fetchBody,
    });

    if (!response.ok) {
      const message = await response.text();
      return NextResponse.json(
        { message: message || `Failed to process request: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
