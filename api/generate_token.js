// File: /api/generate_token.js
import braintree from "braintree";

export default async function handler(req, res) {
  // Allow only GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Create a gateway instance using your Braintree sandbox credentials
    const gateway = new braintree.BraintreeGateway({
      environment: braintree.Environment.Sandbox, // change to Production later
      merchantId: process.env.BRAINTREE_MERCHANT_ID,
      publicKey: process.env.BRAINTREE_PUBLIC_KEY,
      privateKey: process.env.BRAINTREE_PRIVATE_KEY,
    });

    // Generate a client token
    const response = await gateway.clientToken.generate({});

    // Send the token to your frontend
    res.status(200).json({ clientToken: response.clientToken });
  } catch (err) {
    console.error("Error generating client token:", err);
    res.status(500).json({ error: "Failed to generate client token" });
  }
}
