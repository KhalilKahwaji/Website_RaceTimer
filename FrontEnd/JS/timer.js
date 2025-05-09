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
        this.times = [ 0, 0, 0 ];
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

    const action = confirm("Do you want to send the laps to the server?\nPress Cancel to download them as CSV instead.");

    if (action) {
        this.sendLapsToBackend(event_id.trim(), times);
    } else {
        this.downloadLapsAsCSV(event_id.trim(), times);
    }
}

sendLapsToBackend(event_id, laps) {
    const payload = {
        event_id,
        laps
    };

    if (!navigator.onLine) {
        localStorage.setItem("offline_laps", JSON.stringify(payload));
        alert("You are offline. Laps saved in localStorage.");
        return;
    }

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
        var diff = timestamp - this.time;
        // Hundredths of a second are 100 ms
        this.times[2] += diff / 10;
        // Seconds are 100 hundredths of a second
        if (this.times[2] >= 100) {
            this.times[1] += 1;
            this.times[2] -= 100;
        }
        // Minutes are 60 seconds
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
${pad0(Math.floor(times[2]), 2)}`;
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