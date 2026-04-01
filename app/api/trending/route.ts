import { NextResponse } from "next/server";
//api response par
export default async function get_trending() {
    const res = await fetch("https://api.openhands.space/api/community/trending");
    const data = await res.json();
    return NextResponse.json(data);
}