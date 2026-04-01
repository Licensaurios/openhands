import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";

  const res = await fetch(`https://api.openhands.space/resources/?page=${page}`);
  const data = await res.json();

  return NextResponse.json(data);
}