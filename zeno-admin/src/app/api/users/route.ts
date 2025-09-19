import { NextRequest, NextResponse } from "next/server";

const baseUrl = process.env.BASE_URL;

export async function GET(request: NextRequest) {
  const token = request.headers.get("authorization")?.split(" ")[1];
  const searchParams = new URL(request.url).searchParams;
  const ids = searchParams.get("ids");

  if (!ids) {
    return NextResponse.json({ message: "User not found in the system" }, { status: 400 });
  }

  const response = await fetch(`${baseUrl}/users/?ids=${ids}`, {
    headers: {
      ...(token ? { Authorization: `Token ${token}` } : {}),
    },
  });

  const result = await response.json();
  return NextResponse.json(result, { status: 200 });
}