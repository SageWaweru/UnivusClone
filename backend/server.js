import express from "express"; 
import cors from "cors"; 
import fetch from "node-fetch";

const app = express();
const PORT = 5000;

app.use(cors());

app.get("/api/videos", async (req, res) => {
  try {
    const apiKey = req.query.apiKey; 
    if (!apiKey) {
      return res.status(400).json({ error: "API Key is required" });
    }

    const response = await fetch(
      "https://api.pexels.com/videos/search?query=nature&per_page=5",
      { headers: { Authorization: apiKey } }
    );

    if (!response.ok) throw new Error("Failed to fetch videos");

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/images", async (req, res) => {
  try {
    const apiKey = req.query.apiKey;
    if (!apiKey) {
      return res.status(400).json({ error: "API Key is required" });
    }

    const response = await fetch(
      "https://api.pexels.com/v1/curated?per_page=9",
      { headers: { Authorization: apiKey } }
    );

    if (!response.ok) throw new Error("Failed to fetch images");

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
