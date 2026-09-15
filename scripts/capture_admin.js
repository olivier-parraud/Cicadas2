import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUTPUT_DIR = 'dossier_captures';

async function main() {
    console.log('1. Récupération du token Admin...');
    const loginRes = await fetch('http://localhost:5050/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@cicados.fr', password: 'Admin123!' })
    });
    
    if (!loginRes.ok) {
        throw new Error('Échec login admin: ' + await loginRes.text());
    }
    const { token, user } = await loginRes.json();
    console.log('✅ Token récupéré pour Admin:', user.email);

    console.log('2. Lancement de Chrome headless...');
    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

    // Naviguer sur le site pour initialiser le localStorage
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
    await page.evaluate((t, u) => {
        localStorage.setItem('token', t);
        localStorage.setItem('user', JSON.stringify(u));
    }, token, user);

    console.log('3. Navigation vers le Dashboard Admin...');
    await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    // Capture 1: Réservations
    console.log('📸 Capture 1: Réservations...');
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'capture_admin_reservations.png') });

    // Capture 2: Tournois
    console.log('📸 Capture 2: Tournois...');
    const tourneyBtn = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const b = buttons.find(el => el.textContent.includes('Tournois'));
        if (b) { b.click(); return true; }
        return false;
    });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'capture_admin_tournois.png') });

    // Capture 3: Jeux de société
    console.log('📸 Capture 3: Ludothèque & BGG...');
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const b = buttons.find(el => el.textContent.includes('Jeux') || el.textContent.includes('Ludothèque'));
        if (b) { b.click(); return true; }
        return false;
    });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'capture_admin_jeux.png') });

    // Capture 4: Messages / Support
    console.log('📸 Capture 4: Messages & Modération...');
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const b = buttons.find(el => el.textContent.includes('Messages') || el.textContent.includes('Contact'));
        if (b) { b.click(); return true; }
        return false;
    });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'capture_admin_messages.png') });

    await browser.close();
    console.log('🎉 Toutes les captures Admin sont générées avec succès !');
}

main().catch(err => {
    console.error('Erreur:', err);
    process.exit(1);
});
