import { getCloudinaryImages } from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const folder = searchParams.get("folder") || undefined;
  const images = await getCloudinaryImages(folder);
  return NextResponse.json(images);
}
