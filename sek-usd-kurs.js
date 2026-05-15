// Script för att visa svenska kronans kurs mot dollar
// Använder Frankfurter API (gratis, ingen API-nyckel behövs)

const https = require('https');

async function hämtaValutakurs() {
    try {
        console.log('Hämtar aktuell valutakurs...\n');

        // Hämta aktuell kurs från Frankfurter API
        const data = await new Promise((resolve, reject) => {
            https.get('https://api.frankfurter.app/latest?from=SEK&to=USD', (res) => {
                let body = '';

                res.on('data', (chunk) => {
                    body += chunk;
                });

                res.on('end', () => {
                    try {
                        resolve(JSON.parse(body));
                    } catch (e) {
                        reject(e);
                    }
                });
            }).on('error', (e) => {
                reject(e);
            });
        });

        // Extrahera information
        const datum = data.date;
        const kurs = data.rates.USD;
        const inverterad = (1 / kurs).toFixed(4);

        // Visa resultatet
        console.log('=================================');
        console.log('  VALUTAKURS SEK/USD');
        console.log('=================================');
        console.log(`Datum: ${datum}`);
        console.log(`\n1 SEK = ${kurs} USD`);
        console.log(`1 USD = ${inverterad} SEK`);
        console.log('=================================\n');

        // Visa några exempel
        console.log('Exempel:');
        console.log(`100 SEK = ${(100 * kurs).toFixed(2)} USD`);
        console.log(`1000 SEK = ${(1000 * kurs).toFixed(2)} USD`);
        console.log(`100 USD = ${(100 * inverterad).toFixed(2)} SEK`);
        console.log(`1000 USD = ${(1000 * inverterad).toFixed(2)} SEK\n`);

    } catch (error) {
        console.error('Ett fel uppstod:', error.message);
    }
}

// Kör funktionen
hämtaValutakurs();
