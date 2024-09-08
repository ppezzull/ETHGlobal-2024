import { NextResponse } from "next/server";
import { getSubscriber } from "~~/services/turso/subscription";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  try {
    const subscriber = await getSubscriber(address);
    const isSubscribed = !!subscriber;
    return NextResponse.json({ isSubscribed });
  } catch (error) {
    console.error("Error checking subscription:", error);
    return NextResponse.json({ error: "An error occurred while checking the subscription" }, { status: 500 });
  }
}
