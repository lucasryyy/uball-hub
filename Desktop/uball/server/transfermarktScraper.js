import fetch from "node-fetch";
import * as cheerio from "cheerio";
import db from './db.js';

const TRANSFER_URL = "https://www.transfermarkt.com/statistik/neuestetransfers";

export async function scrapeTransfers() {
  try {
    const res = await fetch(TRANSFER_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Try multiple possible selectors for the transfer table
    const possibleSelectors = [
      ".responsive-table table tbody tr",
      "table.items tbody tr",
      ".tm-table tbody tr",
      "tbody tr"
    ];

    let rows = $();
    for (const selector of possibleSelectors) {
      rows = $(selector);
      if (rows.length > 0) {
        console.log(`Found ${rows.length} rows with selector: ${selector}`);
        break;
      }
    }

    if (rows.length === 0) {
      console.log("No transfer rows found. Available tables:");
      $('table').each((i, table) => {
        console.log(`Table ${i}: ${$(table).find('tbody tr').length} rows`);
      });
      
      // Return mock data for testing
      return getMockTransfers();
    }

    const transfers = [];
    let validRowsFound = 0;
    
    rows.each((index, row) => {
      try {
        const cells = $(row).find("td");
        if (cells.length < 8) {
          // Skip rows with insufficient cells - these are likely empty or irrelevant rows
          return;
        }
        
        // Check if this row actually contains transfer data by looking for player name
        const potentialPlayer = $(cells[0]).text().trim();
        if (!potentialPlayer || potentialPlayer.length < 2) {
          // Skip rows without valid player names
          return;
        }
        
        validRowsFound++;
        const rawData = cells.map((i, cell) => {
          const cellObj = {
            text: $(cell).text().trim(),
            html: $(cell).html(),
            imgs: $(cell).find('img').map((j, img) => ({
              src: $(img).attr('src'),
              dataSrc: $(img).attr('data-src'),
              alt: $(img).attr('alt'),
              title: $(img).attr('title')
            })).get()
          };
          return cellObj;
        }).get();
        let player = rawData[0]?.text.split('\n')[0].trim() || `Player ${index + 1}`;
        let playerImg = rawData[0]?.imgs[0]?.dataSrc ? (rawData[0].imgs[0].dataSrc.startsWith('http') ? rawData[0].imgs[0].dataSrc : 'https:' + rawData[0].imgs[0].dataSrc) : "https://img.a.transfermarkt.technology/portrait/medium/default.jpg";
        let position = rawData[3]?.text.trim() || "Unknown";
        let age = rawData[4]?.text.trim();
        if (!/^\d{1,2}$/.test(age)) age = "Unknown";
        let nationality = "Unknown";
        if (rawData[5]?.imgs?.length) {
          nationality = rawData[5].imgs[0].title || rawData[5].imgs[0].alt || "Unknown";
        }
        let fromClub = "Unknown";
        if (rawData[6]?.imgs?.length) {
          fromClub = rawData[6].imgs[0].title || rawData[6].imgs[0].alt || rawData[6].text.split('\n')[0].trim();
        } else if (rawData[6]?.text) {
          fromClub = rawData[6].text.split('\n')[0].trim();
        }
        let toClub = "Unknown";
        if (rawData[10]?.imgs?.length) {
          toClub = rawData[10].imgs[0].title || rawData[10].imgs[0].alt || rawData[10].text.split('\n')[0].trim();
        } else if (rawData[10]?.text) {
          toClub = rawData[10].text.split('\n')[0].trim();
        }
        let fee = "Undisclosed";
        if (rawData[14]?.text) {
          fee = rawData[14].text.trim();
          // Clean up fee formatting: remove duplicate/misplaced euro signs and whitespace
          fee = fee.replace(/€+/g, "€").replace(/^€\s*€/, "€").replace(/\s+/g, " ").trim();
        }
        const transferType = fee.toLowerCase().includes("loan") ? "loan" : "permanent";

        // Clean up the data
        if (!player || player === "Unknown" || player === "") {
          player = `Player ${index + 1}`;
        }

        // Extract player profile URL
        let profileUrl = null;
        const playerLink = $(cells[0]).find("a.spielprofil_tooltip").attr("href") || $(cells[0]).find("a[title]").attr("href") || $(cells[0]).find("a").first().attr("href");
        if (playerLink) {
          profileUrl = `https://www.transfermarkt.com${playerLink}`;
        }
        transfers.push({
          player: player,
          playerImg: playerImg,
          age: age,
          nationality: nationality,
          position: position,
          from: fromClub,
          to: toClub,
          fee: fee,
          date: new Date().toISOString(),
          transferType: transferType,
          rawData: rawData
        });
      } catch (error) {
        console.error(`Error processing row ${index}:`, error);
      }
    });
    
    console.log(`Successfully scraped ${transfers.length} transfers from ${validRowsFound} valid rows out of ${rows.length} total rows`);
    return transfers.slice(0, 30);

  } catch (error) {
    console.error("Scraping failed:", error);
    return [];
  }
}

export async function scrapeAndStoreTransfers() {
  try {
    const transfers = await scrapeTransfers();
    
    if (transfers.length === 0) {
      console.log("No transfers to store");
      return;
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    transfers.forEach((t, index) => {
      try {
        // Sanitize the data to prevent SQLite datatype mismatches
        const sanitizedTransfer = {
          player: (t.player || '').toString().trim() || `Player ${index + 1}`,
          age: (t.age || '').toString().trim() || 'Unknown',
          nationality: (t.nationality || '').toString().trim() || 'Unknown',
          position: (t.position || '').toString().trim() || 'Unknown',
          from: (t.from || '').toString().trim() || 'Unknown',
          to: (t.to || '').toString().trim() || 'Unknown',
          fee: (t.fee || '').toString().trim() || 'Undisclosed',
          transferType: (t.transferType || '').toString().trim() || 'permanent',
          playerImg: (t.playerImg || '').toString().trim() || 'https://img.a.transfermarkt.technology/portrait/medium/default.jpg',
          date: (t.date || new Date().toISOString()).toString()
        };
        
        db.run(
          `INSERT OR IGNORE INTO transfers (player, age, nationality, position, fromClub, toClub, fee, transferType, playerImg, date)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            sanitizedTransfer.player, 
            sanitizedTransfer.age, 
            sanitizedTransfer.nationality, 
            sanitizedTransfer.position, 
            sanitizedTransfer.from, 
            sanitizedTransfer.to, 
            sanitizedTransfer.fee, 
            sanitizedTransfer.transferType, 
            sanitizedTransfer.playerImg, 
            sanitizedTransfer.date
          ],
          function(err) {
            if (err) {
              console.error(`Error storing transfer ${index + 1}:`, err);
              errorCount++;
            } else {
              successCount++;
            }
          }
        );
        
      } catch (transferError) {
        console.error(`Error processing transfer ${index + 1}:`, transferError);
        errorCount++;
      }
    });
    
    console.log(`✅ Transfer storage completed: ${successCount} successful, ${errorCount} errors`);
    
  } catch (error) {
    console.error('❌ Transfer scraping and storage failed:', error);
  }
}