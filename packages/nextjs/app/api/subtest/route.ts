import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test createSubscriber
    // const newSubscriberAddress = "0x1234567890123456789012345678901234567890";
    // await createSubscriber(newSubscriberAddress, true);
    // console.log("New subscriber created");

    // // Test getSubscriber
    // const subscriberAddress = "0x1234567890123456789012345678901234567890";
    // const subscriber = await getSubscriber(subscriberAddress);
    // console.log("Subscriber:", subscriber);

    // // Test updateSubscriberNetworkStatus
    // await updateSubscriberNetworkStatus("0x1234567890123456789012345678901234567890", true);
    // console.log("Subscriber network status updated");

    // // Test getBroadcaster
    // const broadcasterAddress = "0x2222222222222222222222222222222222222222";
    // const broadcaster = await getBroadcaster(broadcasterAddress);
    // console.log("Broadcaster:", broadcaster);

    // // // Test createBroadcaster
    // const newBroadcasterAddress = "0x2222222222222222222222222222222222222222";
    // const newBroadcasterName = "New Broadcaster";
    // await createBroadcaster(newBroadcasterAddress, newBroadcasterName);
    // console.log("New broadcaster created");

    // // Test getConsentProof
    // const consentProof = await getConsentProof(subscriberAddress, broadcasterAddress);
    // console.log("Consent Proof:", consentProof);

    // // Test createConsentProof
    // const signature = "abc123";
    // const timestamp = Date.now();
    // const payloadVersion = 1;
    // await createConsentProof(newSubscriberAddress, newBroadcasterAddress, signature, timestamp, payloadVersion);
    // console.log("New consent proof created");

    return NextResponse.json({ message: "CRUD test completed successfully" });
  } catch (error) {
    console.error("Error during CRUD test:", error);
    return NextResponse.json({ error: "An error occurred during the CRUD test" }, { status: 500 });
  }
}
