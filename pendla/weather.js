async function fetchWeather() {
    const lat = "59.3293";  // Stockholm latitud
    const lon = "18.0686";  // Stockholm longitud
    const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;
    const userAgent = "Mozilla/5.0 (compatible; MyWeatherApp/1.0; email@example.com)"; // Anpassa detta!

    // Kontrollera cache
    const cachedData = localStorage.getItem("weatherData");
    const cachedTime = localStorage.getItem("weatherTime");
    const now = new Date().getTime();

    // Använd cache om den är färsk (mindre än 30 min gammal)
    if (cachedData && cachedTime && now - cachedTime < 30 * 60 * 1000) {
        return displayWeather(JSON.parse(cachedData));
    }

    try {
        const response = await fetch(url, {
            headers: { "User-Agent": userAgent }
        });

        if (!response.ok) {
            throw new Error(`Fel vid hämtning: ${response.status}`);
        }

        const data = await response.json();
        localStorage.setItem("weatherData", JSON.stringify(data));
        localStorage.setItem("weatherTime", now);
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
    const currentTemp = timeseries[0].data.instant.details.air_temperature;
    
    // Hämta dagens min/max temperatur
    const today = new Date().toISOString().split("T")[0];
    let minTemp = Number.MAX_VALUE;
    let maxTemp = Number.MIN_VALUE;
    let weatherSymbol = "";

    timeseries.forEach(entry => {
        const timestamp = entry.time.split("T")[0];
        if (timestamp === today) {
            const temp = entry.data.instant.details.air_temperature;
            if (temp < minTemp) minTemp = temp;
            if (temp > maxTemp) maxTemp = temp;
        }

        // Hämta vädersymbol för nästa 6 timmar (om det finns)
        if (entry.data.next_6_hours && !weatherSymbol) {
            weatherSymbol = entry.data.next_6_hours.summary.symbol_code;
        }
    });

    // Hantera om ingen symbol hittas
    if (!weatherSymbol) {
        weatherSymbol = "unknown";
    }

    // Översättning av vädersymbol till svenska
    const weatherTranslations = {
        "clearsky": "klart",
        "fair": "mestadels soligt",
        "partlycloudy": "delvis molnigt",
        "cloudy": "molnigt",
        "lightrain": "lätt regn",
        "rain": "regn",
        "heavyrain": "kraftigt regn",
        "snow": "snö",
        "lightsnow": "lätt snö",
        "heavysnow": "kraftig snö",
        "fog": "dimma",
        "sleet": "snöblandat regn",
        "thunderstorm": "åska",
        "unknown": "okänt väder"
    };

    const weatherDescription = weatherTranslations[weatherSymbol] || "okänt väder";
    const weatherIcon = getWeatherIcon(weatherSymbol);

    // Uppdatera vädertexten
    document.getElementById("weather-summary").textContent =
        `Nu: ${currentTemp}°C ${weatherIcon}, min ${minTemp}°C, max ${maxTemp}°C, ${weatherDescription}.`;
}

// Funktion för att konvertera symbol_code till emoji
function getWeatherIcon(symbol) {
    const icons = {
        "clearsky": "☀",
        "fair": "🌤",
        "partlycloudy": "⛅",
        "cloudy": "☁",
        "lightrain": "🌦",
        "rain": "🌧",
        "heavyrain": "⛈",
        "snow": "❄",
        "lightsnow": "🌨",
        "heavysnow": "☃",
        "fog": "🌫",
        "sleet": "🌨🌧",
        "thunderstorm": "⚡",
        "unknown": "❓"
    };
    return icons[symbol] || "❓";
}

// Uppdatera vädret var 30:e minut
setInterval(fetchWeather, 30 * 60 * 1000);
fetchWeather();
