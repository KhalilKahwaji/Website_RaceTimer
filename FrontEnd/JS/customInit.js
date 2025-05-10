window.addEventListener('DOMContentLoaded', () => {
  const stored = localStorage.getItem("offline_laps");

  if (stored) {
    try {
      const data = JSON.parse(stored);
      console.log("Parsed data:", data);
      console.log("Laps:", data.laps);

      if (data && Array.isArray(data.laps) && data.laps.length > 0) {
        customConfirm(
          "Offline laps found for event: " + data.event_id + 
          ".\nDo you want to clear them?",
          "Clear Laps",
          "Keep Them"
        ).then(shouldClear => {
          if (shouldClear) {
            localStorage.removeItem("offline_laps");
            alert("Offline laps cleared.");
          } else {
            const ul = document.querySelector('ul.results');
            if (ul) {
              data.laps.forEach(lap => {
                const li = document.createElement('li');
                li.textContent = lap;
                ul.appendChild(li);
              });
            } else {
              console.error("UL element not found.");
            }

            if (typeof stopwatch !== 'undefined' && stopwatch.laps) {
              stopwatch.laps = data.laps.slice();
            }
          }
        });
      }
    } catch (e) {
      console.warn("Malformed localStorage data:", e.message);
    }
  }
});
