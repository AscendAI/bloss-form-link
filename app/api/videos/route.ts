import { getFirebaseVideos } from "@/lib/firebase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const folder = searchParams.get("folder");
  
  if (!folder) {
    return NextResponse.json({ error: "Folder parameter is required" }, { status: 400 });
  }

  const videos = await getFirebaseVideos(folder);
  return NextResponse.json(videos);
}
