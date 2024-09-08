import { tursoClient } from "./client";

export const getSubscriber = async (address: string): Promise<{ address: string; onNetwork: boolean } | null> => {
  const db = tursoClient();
  const result = await db.execute({
    sql: "SELECT address, on_network FROM subscribers WHERE address = :address",
    args: { address },
  });

  if (result.rows.length === 0) {
    return null;
  }

  return {
    address: (result.rows[0].address as string) ?? "",
    onNetwork: Boolean(result.rows[0].on_network) ?? false,
  };
};

export const createSubscriber = async (address: string, onNetwork: boolean): Promise<void> => {
  const db = tursoClient();
  try {
    await db.execute({
      sql: "INSERT INTO subscribers (address, on_network) VALUES (:address, :onNetwork)",
      args: { address, onNetwork },
    });
  } catch (error) {
    console.log("already there", error);
  }
};

export const updateSubscriberNetworkStatus = async (address: string, onNetwork: boolean): Promise<void> => {
  const db = tursoClient();
  await db.execute({
    sql: "UPDATE subscribers SET on_network = :onNetwork WHERE address = :address",
    args: { address, onNetwork },
  });
};

export const getBroadcaster = async (address: string): Promise<{ address: string; name: string } | null> => {
  const db = tursoClient();
  const result = await db.execute({
    sql: "SELECT address, name FROM broadcasters WHERE address = :address",
    args: { address },
  });

  if (result.rows.length === 0) {
    return null;
  }

  return {
    address: (result.rows[0].address as string) ?? "",
    name: (result.rows[0].name as string) ?? "",
  };
};

export const createBroadcaster = async (address: string, name: string): Promise<void> => {
  const db = tursoClient();
  await db.execute({
    sql: "INSERT INTO broadcasters (address, name) VALUES (:address, :name)",
    args: { address, name },
  });
};

export const getConsentProof = async (
  subscriberAddress: string,
  broadcasterAddress: string,
): Promise<{
  subscriberAddress: string;
  broadcasterAddress: string;
  signature: string;
  timestamp: number;
  payloadVersion: number;
} | null> => {
  const db = tursoClient();
  const result = await db.execute({
    sql: "SELECT subscriber_address, broadcaster_address, signature, timestamp, payload_version FROM consent_proofs WHERE subscriber_address = :subscriberAddress AND broadcaster_address = :broadcasterAddress",
    args: { subscriberAddress, broadcasterAddress },
  });

  if (result.rows.length === 0) {
    return null;
  }

  return {
    subscriberAddress: (result.rows[0].subscriber_address as string) ?? "",
    broadcasterAddress: (result.rows[0].broadcaster_address as string) ?? "",
    signature: (result.rows[0].signature as string) ?? "",
    timestamp: Number(result.rows[0].timestamp) ?? 0,
    payloadVersion: Number(result.rows[0].payload_version) ?? 0,
  };
};

export const createConsentProof = async (
  subscriberAddress: string,
  broadcasterAddress: string,
  signature: string,
  timestamp: number,
  payloadVersion: number,
): Promise<void> => {
  const db = tursoClient();
  await db.execute({
    sql: "INSERT INTO consent_proofs (subscriber_address, broadcaster_address, signature, timestamp, payload_version) VALUES (:subscriberAddress, :broadcasterAddress, :signature, :timestamp, :payloadVersion)",
    args: { subscriberAddress, broadcasterAddress, signature, timestamp, payloadVersion },
  });
};
// CREATE TABLE
//   subscribers (
//     id integer PRIMARY KEY,
//     address VARCHAR(42) UNIQUE NOT NULL,
//     on_network BOOLEAN NOT NULL
//   );

// CREATE TABLE
//   broadcasters (
//     id integer  PRIMARY KEY,
//     address VARCHAR(42) UNIQUE NOT NULL,
//     name VARCHAR(255) NOT NULL
//   );

// CREATE TABLE
//   consent_proofs (
//     id integer  PRIMARY KEY,
//     subscriber_address VARCHAR(42) NOT NULL,
//     broadcaster_address VARCHAR(42) NOT NULL,
//     signature TEXT NOT NULL,
//     timestamp BIGINT NOT NULL,
//     payload_version INTEGER NOT NULL,
//     FOREIGN KEY (subscriber_address) REFERENCES subscribers (address),
//     FOREIGN KEY (broadcaster_address) REFERENCES broadcasters (address),
//     UNIQUE (subscriber_address, broadcaster_address)
//   );
