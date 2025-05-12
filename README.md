
# Website RaceTimer

  

Website RaceTimer is a web-based lap timer designed to be simple, accessible, and reliable in various conditions, whether you're coaching a race under the rain or timing an event with gloves on. It includes both a **main timing interface** and a **dashboard** for reviewing stored lap data.

  

---

  

## Requirements

  

Before running this app, ensure the following are installed:

  

- [Node.js](https://nodejs.org/) (v16+ recommended)

- npm

  

---

  

## Installation & Running

  

To run the application:

  

```bash

cd  Website_RaceTimer/BackEnd

npm  install

npm  run  setup

npm  start

```

  

Open the frontend manually:

  

```

http://localhost:8080/raceTimer.html

```

  

To keep the code organized and maintainable, we separated the backend and frontend logic. This is why the backend must be launched from within the `BackEnd/` directory.

  

---

  

## Key Features

  

### raceTimer.html (Main Screen)

  

-  **Start** – starts the stopwatch.

-  **Lap** – records a lap.

-  **Stop** – stops the timer.

-  **Restart** – clears and restarts the timer.

-  **Clear** – clears all recorded laps.

-  **Send** – asks the user for an `Event ID`, then:

	-  **If online**, prompts the user to choose to either:
		-  send laps to the backend server.
		- download as CSV file.

	-  **If offline**, it stores them in `localStorage`. The app will prompt you to reuse or discard them when you're back online.

-  **Voice Control (Chrome only)** – use voice commands like “Start”, “Lap”, “Send”, etc.

-  **Help (?)** – shows a list of voice commands.

-  **Dashboard button** – bottom-right shortcut to view saved laps.

  

###  dashboard.html (Data Viewer)

  

-  **Get all laps** – fetches and displays all recorded laps.

-  **Get laps of race** – enter a race ID to filter and show laps of that specific event.

  

---

  

## 9.1 – Design Decisions

  

The UI and UX were intentionally designed with **accessibility** in mind:

-  **Large, brightly-colored buttons** for visibility in outdoor or rainy conditions, also by older people.

-  **Voice command support** for users who may be wearing gloves or are physically limited.

-  **Offline-safe behavior** using `localStorage`, ensuring no data is lost even without internet.

- Clear separation between **timing interface** and **data review**, promoting simplicity and clarity.

  

---

  

## 9.2 – Use of AI

  

We used **ChatGPT** throughout development, mainly for:

  

-  **Structuring the project** – including setting up an Express backend and static frontend.

-  **Improving syntax and readability** – particularly in `timer.js` and `server.js` to help us with JavaScript syntax.

-  **Accessibility suggestions** – including voice control and UI adjustments for older users or outdoor usage.

-  **Edge case handling** –ex: error messages when no laps exist, or handling `localStorage`.
-  **README.md** – helped us with markdown syntax.


  

We crafted specific prompts like:

-  *"What's the syntax of a promise in JavaScript?"*

-  *"What colors should my buttons be to make a positive UX experience for older people?"*

-  *"What are best practices for accessible buttons in web apps?"*

- *"How can we keep our project structured in a way to improve adding features in the future?*

  


  

---

  

## 9.3 – Post-Prototype Improvements

  

Since the prototype:

- We **refined the UI** with larger, high-contrast buttons to be usable in outdoor or rainy environments.

- We added **voice command support** to enhance usability for older users or those with limited hand mobility.

- We implemented **offline fallback** and **recovery prompts** for better reliability.

- We added a **dashboard page** to view and filter previously stored laps.

  

These updates improved both the accessibility and robustness of the application.

  

---

  

## 9.4 – Reflection

  

This project was a valuable exercise in full-stack JavaScript development and accessible UX/UI design. Early on, we were more focused on the technical part, but after testing with feedback, we realized the importance of **accessibility** and **error tolerance**.

  

Using AI helped us:

-  **Think more empathetically** about users with physical limitations.

-  **Improve code quality** with clearer project structure structure and visible syntax.



  

Looking back, this project demonstrates not only technical skills, but also thoughtful human-centered design.