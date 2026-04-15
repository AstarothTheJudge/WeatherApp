async function getWeather(cityName) {
    try {
        if (!cityName || cityName.trim() === "") {
            throw new Error("Inserisci un nome di città valido.");
        }

        //  Controllo cache
        const cached = getCachedWeather(cityName);
        if (cached) {
            console.log("Dati presi dalla cache");
            return cached;
        }

        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`;
        const geoResponse = await fetch(geoUrl);

        if (!geoResponse.ok) throw new Error("Errore geocoding");

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("Città non trovata.");
        }

        const { latitude, longitude, name } = geoData.results[0];

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) throw new Error("Errore meteo");

        const weatherData = await weatherResponse.json();

        const result = {
            city: name,
            temperature: weatherData.current_weather.temperature,
            description: getWeatherDescription(weatherData.current_weather.weathercode),
            latitude,
            longitude
        };

        //  Salva in cache
        setCachedWeather(cityName, result);

        return result;

    } catch (error) {
        return { error: true, message: error.message };
    }
}
function getWeatherDescription(code) {
    const descriptions = {
        0: "Cielo sereno",
        1: "Prevalentemente sereno",
        2: "Parzialmente nuvoloso",
        3: "Coperto",
        45: "Nebbia",
        48: "Nebbia con brina",
        51: "Pioviggine leggera",
        61: "Pioggia leggera",
        63: "Pioggia moderata",
        65: "Pioggia intensa",
        71: "Neve leggera",
        80: "Rovesci leggeri",
        95: "Temporale"
    };

    return descriptions[code] || "Condizioni sconosciute";
}
async function handleSearch() {
    const city = document.getElementById("cityInput").value;
    const output = document.getElementById("result");

    const result = await getWeather(city);

    if (result.error) {
        output.textContent = "Errore: " + result.message;
        return;
    }

    //  Meteo attuale
    output.innerHTML = `
        <strong>${result.city}</strong><br>
        🌡️ ${result.temperature}°C<br>
        ☁️ ${result.description}<br><br>
        <strong>Previsioni 5 giorni:</strong><br>
    `;

    //  Previsioni
    const forecast = await getFiveDayForecast(result.latitude, result.longitude);

    if (forecast.error) {
        output.innerHTML += "Errore nel recupero previsioni";
        return;
    }

    forecast.slice(0, 5).forEach(day => {
        output.innerHTML += `
            📅 ${day.date} → ${day.min}°C / ${day.max}°C - ${day.description}<br>
        `;
    });
}
async function getFiveDayForecast(lat, lon) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Errore previsione");

        const data = await response.json();

        const forecast = data.daily.time.map((date, i) => ({
            date: date,
            max: data.daily.temperature_2m_max[i],
            min: data.daily.temperature_2m_min[i],
            description: getWeatherDescription(data.daily.weathercode[i])
        }));

        return forecast;

    } catch (error) {
        return { error: true, message: error.message };
    }
}

const CACHE_DURATION = 60 * 60 * 1000; // 1 ora

function getCachedWeather(city) {
    const cached = localStorage.getItem(city.toLowerCase());
    if (!cached) return null;

    const data = JSON.parse(cached);

    if (Date.now() - data.timestamp > CACHE_DURATION) {
        localStorage.removeItem(city.toLowerCase());
        return null;
    }

    return data.value;
}

function setCachedWeather(city, value) {
    localStorage.setItem(city.toLowerCase(), JSON.stringify({
        timestamp: Date.now(),
        value: value
    }));
}

getWeather("Milano").then(result => {
    if (result.error) {
        console.error("Errore:", result.message);
    } else {
        console.log(`Città: ${result.city}`);
        console.log(`Temperatura: ${result.temperature}°C`);
        console.log(`Meteo: ${result.description}`);
    }
});
getWeather("Milano").then(result => {
    if (result.error) {
        console.error("Errore:", result.message);
    } else {
        console.log(result);
    }
});