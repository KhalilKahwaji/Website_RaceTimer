async function getAllLaps() {
    try {
        const res = await fetch("http://localhost:8080/api/lap");
        const data = await res.json();
        document.getElementById("resultsBox").textContent = formatLapResults(data);
    } catch (err) {
        document.getElementById("resultsBox").textContent = "Error fetching all laps.";
        console.error(err);
    }
}

async function getLapsByRace() {
    const raceId = document.getElementById("raceIdInput").value.trim();
    if (!raceId) {
        alert("Please enter a race ID.");
        return;
    }

    try {
        const res = await fetch(`http://localhost:8080/api/lap/${raceId}`);
        const data = await res.json();
        document.getElementById("resultsBox").textContent = formatLapResults(data);
    } catch (err) {
        document.getElementById("resultsBox").textContent = `Error fetching laps for race ID ${raceId}.`;
        console.error(err);
    }
}

function formatLapResults(data) {
    if (!Array.isArray(data) || data.length === 0) {
        return "No laps found.";
    }

    // Group laps by race (event_id)
    const grouped = {};
    data.forEach(lap => {
        if (!grouped[lap.event_id]) grouped[lap.event_id] = [];
        grouped[lap.event_id].push(lap.time);
    });

    // Build formatted output
    let result = "";
    for (const eventId in grouped) {
        result += `-Race ID: ${eventId}\n`;
        grouped[eventId].forEach((time, idx) => {
            result += `    ${idx + 1} - ${time}\n`;
        });
        result += `\n`;
    }
    return result;
}

