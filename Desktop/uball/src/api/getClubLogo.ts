// src/api/getClubLogo.ts
console.log("✅ getClubLogo.ts loaded");

import Database from "better-sqlite3";

type ClubRow = {
  id: number;
  name: string;
  alias: string;
  country: string;
  logo: string;
  league: string;
};

const db = new Database("clubs.db");

export function getClubLogo(name: string): string | null {
  const stmt = db.prepare("SELECT logo FROM clubs WHERE name = ? OR alias = ?");
const result = stmt.get(name, name) as ClubRow | undefined;
  return result?.logo ?? null;
}
