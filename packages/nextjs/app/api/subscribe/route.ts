import { NextResponse } from "next/server";
import { initializeClient } from "~~/services/xmtp/xmtp";
import { base64ToBytes } from "~~/utils/base64ToBytes";

export async function POST(request: Request) {
  const { address, broadcastAddress, consentProof } = await request.json();

  if (!address || !broadcastAddress || !consentProof) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (typeof address !== "string") {
    return NextResponse.json({ error: "Address must be a string" }, { status: 400 });
  }

  if (typeof broadcastAddress !== "string") {
    return NextResponse.json({ error: "Broadcast Address must be a string" }, { status: 400 });
  }

  if (typeof consentProof !== "string") {
    return NextResponse.json({ error: "Consent proof must be a string" }, { status: 400 });
  }

  try {
    // // Create or update the subscriber
    console.log("adding subscriber");
    // // await createSubscriber(address, true);
    console.log("added subscriber");
    console.log("Raw consentProof:", consentProof);
    const consentProofUint8Array = base64ToBytes(consentProof);
    console.log("Decoded consentProof (binary data):", consentProofUint8Array);

    try {
      const xmtpClient = await initializeClient();
      if (xmtpClient) {
        console.log("Client retrieved successfully");

        // const consentProof = invitation.ConsentProofPayload.decode(consentProofUint8Array);
        // console.log("Creating conversation with: ", {
        //   consentProof,
        // });
      } else {
        console.error("Failed to retrieve XMTP client");
      }
    } catch (error) {
      console.log("asd", error);
    }

    // const { signature, timestamp, payloadVersion } = decoded;
    // console.log(signature, timestamp, payloadVersion);

    // // await createConsentProof(address, broadcastAddress, signature, timestamp, payloadVersion);

    return NextResponse.json({ message: "Subscription successful" });
  } catch (error) {
    console.error("Error subscribing:", error);
    return NextResponse.json({ error: "An error occurred while subscribing" }, { status: 500 });
  }
}
