const OPENWEATHER_API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";
const NASA_API_KEY = "YOUR_NASA_API_KEY";
const ELEVENLABS_API_KEY = "YOUR_ELEVENLABS_API_KEY";
const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY";

async function fetchWeather(location) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${OPENWEATHER_API_KEY}&units=metric`);
        const data = await response.json();

        if (data.cod !== 200) throw new Error("Location not found");

        document.getElementById("weatherResult").innerHTML = `
            <h2>Weather in ${data.name}</h2>
            <p>🌡️ Temperature: ${data.main.temp}°C</p>
            <p>☁️ Condition: ${data.weather[0].description}</p>
        `;

        fetchSatelliteData(data.coord.lat, data.coord.lon);
        generateVoiceReport(`The weather in ${data.name} is ${data.main.temp} degrees Celsius with ${data.weather[0].description}.`);
        chatWithAIClone(`What should I do in this weather?`);
    } catch (error) {
        alert(error.message);
    }
}

async function fetchSatelliteData(lat, lon) {
    try {
        const response = await fetch(`https://api.nasa.gov/planetary/earth/assets?lon=${lon}&lat=${lat}&dim=0.1&api_key=${NASA_API_KEY}`);
        const data = await response.json();
        document.getElementById("satellite-view").src = data.url;
    } catch (error) {
        alert("Satellite data not available");
    }
}

async function generateVoiceReport(text) {
    try {
        const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ELEVENLABS_API_KEY}`
            },
            body: JSON.stringify({ text, voice: "your_cloned_voice_id", model: "eleven_monolingual_v1" })
        });
        const blob = await response.blob();
        document.getElementById("voiceCloneAudio").src = URL.createObjectURL(blob);
    } catch (error) {
        alert("Voice cloning failed");
    }
}

async function chatWithAIClone(userInput) {
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{ role: "system", content: "You are an AI clone of the user, provide witty and helpful weather advice." }, { role: "user", content: userInput }],
            })
        });
        const data = await response.json();
        document.getElementById("aiCloneResponse").innerText = data.choices[0].message.content;
    } catch (error) {
        alert("Chatbot AI failed");
    }
}

document.getElementById("getWeather").addEventListener("click", () => {
    const location = document.getElementById("location").value;
    if (location) fetchWeather(location);
});
