# Lausanne in 3 days

A static, mobile-friendly tourist guide to Lausanne: a 3-day itinerary with a tick-off
checklist, an interactive Leaflet map (filters, day routes, "near me"), restaurants,
museums, live weather (Open-Meteo), practical tips, a budget estimator and a French
phrasebook.

Plain HTML/CSS/JS, no build step. Content lives in `data.js`. Leaflet is vendored in
`vendor/leaflet`. Served by nginx; live at https://lausanne.traistaru.net.

Run locally: `python3 -m http.server` in this folder.
Deploy: push to `main` (CI builds the image and deploys via `compose.yml`).
