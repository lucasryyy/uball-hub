import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export async function parseWikiTable(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }
  const html = await res.text();
  const $ = cheerio.load(html);
  const table = $("#League_table").parent().nextAll("table").first();
  const rows = table.find("tbody tr");
  const data = [];
  rows.each((_, row) => {
    const cells = $(row).find('th, td');
    if (cells.length < 10) return;
    const pos = parseInt($(cells[0]).text().trim(), 10);
    if (isNaN(pos)) return;
    data.push({
      position: pos,
      team: $(cells[1]).text().trim(),
      played: parseInt($(cells[2]).text().trim(), 10),
      won: parseInt($(cells[3]).text().trim(), 10),
      drawn: parseInt($(cells[4]).text().trim(), 10),
      lost: parseInt($(cells[5]).text().trim(), 10),
      gf: parseInt($(cells[6]).text().trim(), 10),
      ga: parseInt($(cells[7]).text().trim(), 10),
      gd: parseInt($(cells[8]).text().trim(), 10),
      pts: parseInt($(cells[9]).text().trim(), 10)
    });
  });
  return data;
}
