import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BASE_URL;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ message: "Missing authorization" }, { status: 401 });
  }
  if (!BASE_URL) {
    return NextResponse.json({ message: "Backend not configured" }, { status: 500 });
  }
  try {
    const body = await request.json();
    const { title } = body;
    const backendRes = await fetch(`${BASE_URL}/conversations/${resolvedParams.id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({ title }),
    });
    const data = await backendRes.json().catch(() => ({}));
    if (!backendRes.ok) {
      return NextResponse.json(
        { message: data?.detail || "Failed to update conversation" },
        { status: backendRes.status }
      );
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ message: "Missing authorization" }, { status: 401 });
  }
  if (!BASE_URL) {
    return NextResponse.json({ message: "Backend not configured" }, { status: 500 });
  }
  try {
    const backendRes = await fetch(`${BASE_URL}/conversations/${resolvedParams.id}/`, {
      method: "DELETE",
      headers: { Authorization: authHeader },
    });
    if (!backendRes.ok) {
      const data = await backendRes.json().catch(() => ({}));
      return NextResponse.json(
        { message: data?.detail || "Failed to delete conversation" },
        { status: backendRes.status }
      );
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}