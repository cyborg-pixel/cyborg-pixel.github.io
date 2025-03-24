// Funktion för att översätta vindriktning (grader) till en 16-kompassriktning
function getCompassDirection(degrees) {
    const directions = ["N", "NNO", "NO", "ONO", "O", "OSO", "SO", "SSO",
                        "S", "SSV", "SV", "VSV", "V", "VNV", "NV", "NNV"];
    return directions[Math.round((degrees % 360) / 22.5) % 16];
}

async function fetchWeather() {
    //const lat = "59.3293";  // Stockholm latitud
    //const lon = "18.0686";  // Stockholm longitud
    const lat = "59.3750";  // Tranholmen
    const lon = "18.0892";  // Tranholmen
    const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            mode: "cors",  // Viktigt: Säkerställer CORS-stöd
            cache: "no-cache"  // Förhindrar cacheproblem
        });

        if (!response.ok) {
            throw new Error(`Fel vid hämtning: ${response.status}`);
        }

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error("Fel vid hämtning av väderdata:", error);
        document.getElementById("weather-summary").textContent = "Väderdata ej tillgänglig.";
    }
}


function displayWeather(data) {
    const timeseries = data.properties.timeseries;
    if (!timeseries || timeseries.length === 0) {
        document.getElementById("weather-summary").textContent = "Ingen väderdata tillgänglig.";
        return;
    }

    // Hämta aktuell temperatur
    const currentTemp = Math.round(timeseries[0].data.instant.details.air_temperature);
    const currentWind = Math.round(timeseries[0].data.instant.details.air_temperature);
    const currentWindDir = timeseries[0].data.instant.details.air_temperature;
    
    // Hämta dagens min/max temperatur
    const today = new Date().toISOString().split("T")[0];
    let minTemp = Number.MAX_VALUE;
    let maxTemp = Number.MIN_VALUE;
    let weatherSymbol = "";



    timeseries.forEach(entry => {
        const timestamp = entry.time.split("T")[0];
        if (timestamp === today) {
            const temp = Math.round(entry.data.instant.details.air_temperature);
            if (temp < minTemp) minTemp = temp;
            if (temp > maxTemp) maxTemp = temp;
        }
    });




weatherSymbol = timeseries[0].data.next_1_hours.summary.symbol_code;
let firstEntry = timeseries[0];
let windSpeed = Math.round(firstEntry.data.instant.details.wind_speed);  // Avrundad vindstyrka
let windDirection = getCompassDirection(firstEntry.data.instant.details.wind_from_direction); // Kompassriktning

// Skapa kompakt sträng
let wind = `${windSpeed} m/s ${windDirection}`;





    // Hantera om ingen symbol hittas
    if (!weatherSymbol) {
        weatherSymbol = "unknown";
    }

// Översättning av vädersymboler till svenska med emojis
const weatherTranslations = {
    // Klart väder
    "clearsky_day": "klart ☀️😎",
    "clearsky_night": "klart 🌙✨",
    "clearsky_polartwilight": "klart 🌌",

    // Lätt molnighet
    "fair_day": "mestadels soligt 🌤️😊",
    "fair_night": "mestadels klart 🌙🌤️",
    "fair_polartwilight": "mestadels klart 🌥️🌌",

    // Delvis molnigt
    "partlycloudy_day": "delvis molnigt ⛅🙂",
    "partlycloudy_night": "delvis molnigt 🌙☁️",
    "partlycloudy_polartwilight": "delvis molnigt 🌥️🌌",

    // Molnigt
    "cloudy": "molnigt ☁️😐",

    // Regnskurar
    "rainshowers_day": "regnskurar 🌦️🌈",
    "rainshowers_night": "regnskurar 🌧️🌙",
    "rainshowers_polartwilight": "regnskurar 🌧️🌌",

    // Regnskurar med åska
    "rainshowersandthunder_day": "regnskurar med åska ⛈️⚡😱",
    "rainshowersandthunder_night": "regnskurar med åska ⛈️⚡🌙",
    "rainshowersandthunder_polartwilight": "regnskurar med åska ⛈️⚡🌌",

    // Snöblandade regnskurar
    "sleetshowers_day": "snöblandade regnskurar 🌨️🌧️🥶",
    "sleetshowers_night": "snöblandade regnskurar 🌨️🌧️🌙",
    "sleetshowers_polartwilight": "snöblandade regnskurar 🌨️🌧️🌌",

    // Snöbyar
    "snowshowers_day": "snöbyar 🌨️❄️",
    "snowshowers_night": "snöbyar 🌨️🌙",
    "snowshowers_polartwilight": "snöbyar 🌨️🌌",

    // Regn
    "lightrain": "lätt regn 🌧️🌂",
    "rain": "regn 🌧️☔",
    "heavyrain": "kraftigt regn ⛈️💦😓☔",

    // Regn med åska
    "rainandthunder": "regn med åska ⛈️⚡😨☔",
    "heavyrainandthunder": "kraftigt regn med åska ⛈️⚡🌧️😱☔",

    // Snöblandat regn
    "sleet": "snöblandat regn 🌨️🌧️",
    "sleetandthunder": "snöblandat regn med åska 🌨️⚡🥶",

    // Snö
    "lightsnow": "lätt snö 🌨️❄️",
    "snow": "snö ❄️⛄",
    "heavysnow": "kraftig snö ☃️🌨️🥶",

    // Snöbyar med åska
    "snowshowersandthunder_day": "snöbyar med åska 🌨️⚡😱",
    "snowshowersandthunder_night": "snöbyar med åska 🌨️⚡🌙",
    "snowshowersandthunder_polartwilight": "snöbyar med åska 🌨️⚡🌌",

    // Snö med åska
    "snowandthunder": "snö med åska 🌨️⚡😳",

    // Lätta regnskurar med åska
    "lightrainshowersandthunder_day": "lätta regnskurar med åska 🌦️⚡🙂",
    "lightrainshowersandthunder_night": "lätta regnskurar med åska 🌦️⚡🌙",
    "lightrainshowersandthunder_polartwilight": "lätta regnskurar med åska 🌦️⚡🌌",

    // Dimma
    "fog": "dimma 🌫️😶‍🌫️",

    // Okänt
    "unknown": "okänt väder ❓🤷‍♂️"
};

    const weatherDescription = weatherTranslations[weatherSymbol] || "okänt väder";

    // Uppdatera vädertexten
    document.getElementById("weather-summary").innerHTML =
        `<li>${currentTemp}°C, ${wind}, ${weatherDescription}</li>`; 
}


// Uppdatera väder när sidan blir synlig igen
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        fetchWeather();
    }
});

// Uppdatera vädret var 10:e minut
setInterval(fetchWeather, 10 * 60 * 1000);
fetchWeather();
