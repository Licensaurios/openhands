import { NextResponse } from "next/server";
export default async function GET() {
    const res = await fetch("https:api.openhands.space/api/community/tags/trending");
    const data = res.json();
    return NextResponse.json(data)
}