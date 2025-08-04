import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiUrl = `${process.env.AI_APP_ENDPOINT}/get_random_word`;
  const apiKey = process.env.AI_APP_TOKEN;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "x-api-key": apiKey || "",
      },
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Error in /api/get_random_class:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
