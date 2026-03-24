import { getCloudinaryVideos } from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function GET() {
  const videos = await getCloudinaryVideos();
  return NextResponse.json(videos);
}
