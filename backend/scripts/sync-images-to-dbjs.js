import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from '../src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    console.log("Starting sync of updated BGG images to db.js configuration...");

    // 1. Fetch all games from the database
    const dbGames = await query("SELECT name, image_url FROM board_games");
    console.log(`Found ${dbGames.length} games in database.`);

    // Filter to only games that have BGG images
    const bggGames = dbGames.filter(g => g.image_url && g.image_url.includes("geekdo-images.com"));
    console.log(`Found ${bggGames.length} games with BGG images to sync.`);

    if (bggGames.length === 0) {
        console.log("No BGG images found in database. Exiting.");
        process.exit(0);
    }

    // 2. Read src/config/db.js
    const dbJsPath = path.join(__dirname, '..', 'src', 'config', 'db.js');
    let dbJsContent = fs.readFileSync(dbJsPath, 'utf8');

    let updatedCount = 0;
    for (const game of bggGames) {
        // We want to find the game name in popularGamesMetadata and replace its image_url
        // Structure in db.js is typically:
        // "Game Name": {
        //     min_players: X, max_players: Y, play_time: Z,
        //     category: "...",
        //     description: "...",**
        //     image_url: "OLD_URL",
        //     rules_url: "..."
        // }

        // Escape name for regex
        const escapedName = game.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

        // Match the pattern:
        // "Game Name": {
        //    (any lines)
        //    image_url: "anything",
        const regexStr = `"${escapedName}"\\s*:\\s*\\{[\\s\\S]*?image_url\\s*:\\s*"([^"]+)"`;
        const regex = new RegExp(regexStr);

        const match = dbJsContent.match(regex);
        if (match) {
            const oldUrl = match[1];
            if (oldUrl !== game.image_url) {
                // Construct the exact target block to replace to avoid duplicate replacements
                const targetText = match[0];
                const replacementText = targetText.replace(`"${oldUrl}"`, `"${game.image_url}"`);

                dbJsContent = dbJsContent.replace(targetText, replacementText);
                console.log(`[Synced] "${game.name}" in db.js.`);
                updatedCount++;
            }
        } else {
            console.log(`[Not Found in db.js] "${game.name}"`);
        }
    }

    if (updatedCount > 0) {
        fs.writeFileSync(dbJsPath, dbJsContent, 'utf8');
        console.log(`Successfully updated ${updatedCount} games in db.js.`);
    } else {
        console.log("All BGG images are already in sync with db.js.");
    }

    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
