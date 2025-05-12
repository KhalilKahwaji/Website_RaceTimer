



class Stopwatch {
    constructor(display, results) {
        this.running = false;
        this.display = display;
        this.results = results;
        this.laps = [];
        this.reset();
        this.print(this.times);
    }
    
    reset() {
        this.times = [ 0, 0, 0, 0 ]; // [hours, minutes, seconds, hundredths]
    }
    
    start() {
        if (!this.time) this.time = performance.now();
        if (!this.running) {
            this.running = true;
            requestAnimationFrame(this.step.bind(this));
        }
    }
    
    lap() {
        let times = this.times;
        let li = document.createElement('li');
        li.innerText = this.format(times);
        this.results.appendChild(li);
    }
    
//either save as csv or send to backend
handleLapsSubmission() {
    const times = Array.from(this.results.children).map(li => li.innerText);

    if (times.length === 0) {
        alert("No laps to submit.");
        return;
    }

    const event_id = prompt("Enter Event ID:");
    if (!event_id || event_id.trim() === "") {
        alert("Event ID is required.");
        return;
    }

    const self = this; // save reference to Stopwatch
    const id = event_id.trim();

    const payload = {
        event_id: id,
        laps: times
    };
    if(!payload.event_id || payload.laps.length === 0) {
        alert("Event ID and laps are required.");
    }
        if (!navigator.onLine) {
            localStorage.setItem("offline_laps", JSON.stringify(payload));
            alert("You are offline. Laps saved in localStorage.");
            return;
        }

    customConfirm(
    "Do you want to send the laps to the server?\nPress Cancel to download them as CSV instead.",
    "Send to Server",
    "Download CSV"
    ).then(action => {
    if (action) {
        self.sendLapsToBackend(event_id.trim(), times);
    } else {
        self.downloadLapsAsCSV(event_id.trim(), times);
    }
    });
}


sendLapsToBackend(event_id, laps) {
    const payload = {
        event_id,
        laps
    };

    fetch('/api/lap/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).then(res => {
        if (!res.ok) throw new Error("Failed to send laps");
        alert("Laps sent successfully.");
        localStorage.removeItem("offline_laps");
    }).catch(err => {
        console.error("Error sending laps:", err);
        alert("Failed to send laps.");
    });
}


downloadLapsAsCSV(event_id, laps) {
    const header = "Event ID,Lap Time\n";
    const rows = laps.map(lap => `${event_id},${lap}`).join("\n");
    const content = header + rows;

    const blob = new Blob([content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${event_id}_laps.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

getLaps() {
   

    fetch('/api/lap', {
        method: 'Get',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            event_id: event_id.trim(),
            laps: times
        })
    }).then(res => {
        if (!res.ok) throw new Error("Failed to send laps");
        alert("Laps sent successfully!");
    }).catch(err => {
        console.error("Error sending laps:", err);
        alert("Failed to send laps.");
    });
}


    stop() {
        this.running = false;
        this.time = null;
    }

    restart() {
        if (!this.time) this.time = performance.now();
        if (!this.running) {
            this.running = true;
            requestAnimationFrame(this.step.bind(this));
        }
        this.reset();
    }
    
    clear() {
        clearChildren(this.results);
    }
    
    step(timestamp) {
        if (!this.running) return;
        this.calculate(timestamp);
        this.time = timestamp;
        this.print();
        requestAnimationFrame(this.step.bind(this));
    }
    
    calculate(timestamp) {
        const diff = timestamp - this.time;
        this.times[3] += diff / 10;

        if (this.times[3] >= 100) {
            this.times[2] += 1;
            this.times[3] -= 100;
        }

        if (this.times[2] >= 60) {
            this.times[1] += 1;
            this.times[2] -= 60;
        }

        if (this.times[1] >= 60) {
            this.times[0] += 1;
            this.times[1] -= 60;
        }
    }
    
    print() {
        this.display.innerText = this.format(this.times);
    }
    
    format(times) {
        return `\
    ${pad0(times[0], 2)}:\
    ${pad0(times[1], 2)}:\
    ${pad0(times[2], 2)}:\
    ${pad0(Math.floor(times[3]), 2)}`;
    }
}

function pad0(value, count) {
    var result = value.toString();
    for (; result.length < count; --count)
        result = '0' + result;
    return result;
}

function clearChildren(node) {
    while (node.lastChild)
        node.removeChild(node.lastChild);
}

let stopwatch = new Stopwatch(
    document.querySelector('.stopwatch'),
    document.querySelector('.results'));

    document.getElementById("voiceBtn").addEventListener("click", () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Speech Recognition not supported in this browser.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    const voiceBtn = document.getElementById("voiceBtn");
    voiceBtn.classList.add("active");

    recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase().trim();
        console.log("Voice Command:", command);

        // Map of commands to buttons or actions
        const actionMap = {
            "start": () => stopwatch.start(),
            "lap": () => stopwatch.lap(),
            "stop": () => stopwatch.stop(),
            "restart": () => stopwatch.restart(),
            "clear": () => stopwatch.clear(),
            "send": () => stopwatch.handleLapsSubmission()
        };

        if (actionMap[command]) {
            actionMap[command]();
            flashButton(command);
        } else {
            alert("Unrecognized command: " + command);
        }

        voiceBtn.classList.remove("active");
    };

    recognition.onerror = (e) => {
        console.error("Speech error:", e);
        alert("Speech recognition failed.");
        voiceBtn.classList.remove("active");
    };
});

// Flash the matching button green
function flashButton(action) {
    const buttons = document.querySelectorAll("button");
    buttons.forEach(btn => {
        if (btn.textContent.trim().toLowerCase() === action) {
            btn.style.backgroundColor = "green";
            setTimeout(() => {
                btn.style.backgroundColor = ""; // restore original
            }, 800);
        }
    });
}
document.getElementById("helpBtn").addEventListener("click", () => {
    alert(`🎤 Voice Commands You Can Say:
    
• "Start" – Start the timer
• "Lap" – Record a lap
• "Stop" – Stop the timer
• "Restart" – Reset and start again
• "Clear" – Clear all laps
• "Send" – Submit laps to server or download CSV`);
});