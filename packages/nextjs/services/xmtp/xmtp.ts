import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";

// Get the broadcaster address and private key from environment variables
const BROADCAST_ADDRESS = process.env.NEXT_PUBLIC_BROADCAST_ADDRESS;
const DEPLOYER_PRIVATE_KEY = process.env.NEXT_DEPLOYER_PRIVATE_KEY;

if (!BROADCAST_ADDRESS || !DEPLOYER_PRIVATE_KEY) {
  throw new Error("Missing required environment variables: NEXT_PUBLIC_BROADCAST_ADDRESS or NEXT_DEPLOYER_PRIVATE_KEY");
}

// Initialize the XMTP client
export async function initializeClient() {
  try {
    const account = privateKeyToAccount(DEPLOYER_PRIVATE_KEY as `0x${string}`);
    console.log(DEPLOYER_PRIVATE_KEY, "AJ");
    const signer = createWalletClient({
      account,
      chain: mainnet,
      transport: http(),
    });
    console.log(signer.account.address, "AHH");
    // const xmtpClient = await Client.create(signer, {
    //   env: "dev",
    // });

    // console.log(`Client initialized at fort, `);

    // console.log(`Client initialized at: ${xmtpClient.address}`);
    // return xmtpClient
    return true;
  } catch (err) {
    console.error("Failed to initialize client:", err);
  }
}
