import express, { type Request, type Response } from "express";
import cors from "cors";

let getClubLogo: (name: string) => string | null;

try {
  const mod = await import("./getClubLogo.js");
  getClubLogo = mod.getClubLogo;
} catch (err) {
  console.error("💥 FEJL VED IMPORT AF getClubLogo:", err);
  process.exit(1);
}

const app = express();
app.use(cors());

app.get("/api/club/logo", (req: Request, res: Response) => {
  const name = req.query.name?.toString();
  if (!name) return res.status(400).json({ error: "Missing name" });

  const logo = getClubLogo(name);
  if (!logo) return res.status(404).json({ error: "Not found" });

  return res.json({ logo });
});

app.listen(5000, () => {
  console.log("🚀 API running on http://localhost:5000");
});
