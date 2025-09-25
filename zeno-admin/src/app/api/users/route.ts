import { NextRequest, NextResponse } from "next/server";
import type { User } from "../../hooks/useFetchUsers";

const BASE_URL = process.env.BASE_URL ; 

export async function GET(request: NextRequest) {
  try {
    let token = request.headers.get("x-auth-token");
    if (!token) {
      const authHeader = request.headers.get("authorization");
      token = authHeader?.startsWith("Token ") ? authHeader.split(" ")[1] : null;
    }

    if (!token) {
      return NextResponse.json({ message: "No token found in request headers" }, { status: 401 });
    }

    const searchParams = new URL(request.url).searchParams;
    const ids = searchParams.get("ids");

    const fetchUrl = ids ? `${BASE_URL}/users/?ids=${ids}` : `${BASE_URL}/users/`;

    const response = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: `Failed to fetch users: ${response.statusText}` },
        { status: response.status }
      );
    }

    const users: User[] = await response.json();

    return NextResponse.json(users, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}