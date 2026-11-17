(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, attrs = {}, html = "") => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    n.innerHTML = html;
    return n;
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const dirUrl = (p) => `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}&travelmode=walking`;
  const store = {
    get: (k, d) => { try { return JSON.parse(localStorage.getItem("lausanne:" + k)) ?? d; } catch { return d; } },
    set: (k, v) => { try { localStorage.setItem("lausanne:" + k, JSON.stringify(v)); } catch { /* private mode */ } },
  };

  // ---------- 3-day plan ----------
  const done = new Set(store.get("done", []));
  const totalStops = DAYS.reduce((n, d) => n + d.stops.length, 0);
  let activeDay = store.get("day", 1);
  if (!DAYS.some((d) => d.id === activeDay)) activeDay = 1;

  function updateProgress() {
    $("#progressBar").style.width = `${(done.size / totalStops) * 100}%`;
    $("#progressText").textContent = `${done.size} of ${totalStops} stops done`;
  }

  function renderTabs() {
    const tabs = $("#dayTabs");
    tabs.innerHTML = "";
    DAYS.forEach((d) => {
      const b = el("button", {
        role: "tab", type: "button", "aria-selected": String(d.id === activeDay),
        class: "tab" + (d.id === activeDay ? " on" : ""), style: `--c:${d.color}`,
      }, `<span class="tab-emoji">${d.emoji}</span><span><b>Day ${d.id}</b><small>${esc(d.title)}</small></span>`);
      b.addEventListener("click", () => { activeDay = d.id; store.set("day", d.id); renderTabs(); renderDay(); });
      tabs.appendChild(b);
    });
  }

  function renderDay() {
    const d = DAYS.find((x) => x.id === activeDay);
    const panel = $("#dayPanel");
    const stops = d.stops.map((s, i) => {
      const p = PLACES[s.place];
      const key = `d${d.id}-${s.place}`;
      const checked = done.has(key);
      return `
      <li class="stop${checked ? " done" : ""}" style="--c:${d.color}">
        <div class="stop-time"><b>${s.time}</b><small>${esc(s.dur)}</small></div>
        <div class="stop-dot" aria-hidden="true">${i + 1}</div>
        <div class="stop-body">
          <h4>${CATS[p.cat].icon} ${esc(p.name)}</h4>
          <p>${esc(s.text)}</p>
          <p class="tip">💡 ${esc(p.tip)}</p>
          <div class="stop-meta">
            <span>🎟️ ${esc(p.price)}</span>
            <span>🚶 ${esc(s.travel)}</span>
          </div>
          <div class="stop-actions">
            <label class="check"><input type="checkbox" data-key="${key}" ${checked ? "checked" : ""}> Done</label>
            <a href="${dirUrl(p)}" target="_blank" rel="noopener">Directions</a>
            <a href="${esc(p.url)}" target="_blank" rel="noopener">Official site</a>
            <button type="button" class="linklike" data-map="${s.place}">Show on map</button>
          </div>
        </div>
      </li>`;
    }).join("");
    panel.innerHTML = `
      <div class="day-head" style="--c:${d.color}">
        <h3>${d.emoji} Day ${d.id}: ${esc(d.title)}</h3>
        <p>${esc(d.summary)}</p>
      </div>
      <ol class="timeline">${stops}</ol>
      <div class="rain">☔ <b>If it rains:</b> ${esc(d.rain)}</div>`;
    panel.querySelectorAll("input[data-key]").forEach((cb) =>
      cb.addEventListener("change", () => {
        cb.checked ? done.add(cb.dataset.key) : done.delete(cb.dataset.key);
        store.set("done", [...done]);
        cb.closest(".stop").classList.toggle("done", cb.checked);
        updateProgress();
      }));
    panel.querySelectorAll("[data-map]").forEach((b) =>
      b.addEventListener("click", () => focusPlace(b.dataset.map, true)));
    updateProgress();
  }

  // ---------- cards ----------
  function card(id) {
    const p = PLACES[id];
    const c = CATS[p.cat];
    return `
    <article class="card" style="--c:${c.color}">
      <div class="card-top"><span class="badge">${c.icon} ${c.label}</span><span class="price">${esc(p.price)}</span></div>
      <h3>${esc(p.name)}</h3>
      ${p.food ? `<p class="food">${esc(p.food)}</p>` : ""}
      <p>${esc(p.desc)}</p>
      <p class="tip">💡 ${esc(p.tip)}</p>
      <div class="card-actions">
        <a href="${dirUrl(p)}" target="_blank" rel="noopener">Directions</a>
        <a href="${esc(p.url)}" target="_blank" rel="noopener">Official site</a>
        <button type="button" class="linklike" data-map="${id}">On map</button>
      </div>
    </article>`;
  }
  const idsBy = (fn) => Object.keys(PLACES).filter((id) => fn(PLACES[id]));

  let priceFilter = "all";
  function renderFood() {
    const ids = idsBy((p) => p.cat === "food").filter((id) => priceFilter === "all" || PLACES[id].price === priceFilter);
    $("#foodCards").innerHTML = ids.map(card).join("") || `<p class="muted">Nothing at this price.</p>`;
    bindMapButtons($("#foodCards"));
  }
  function renderPriceFilters() {
    const box = $("#priceFilters");
    const opts = [["all", "All"], ["$", "$ Cheap"], ["$$", "$$ Mid"], ["$$$", "$$$ Nice"], ["$$$$", "$$$$ Splurge"]];
    box.innerHTML = "";
    opts.forEach(([v, label]) => {
      const b = el("button", { type: "button", class: "chip" + (priceFilter === v ? " on" : "") }, label);
      b.addEventListener("click", () => { priceFilter = v; renderPriceFilters(); renderFood(); });
      box.appendChild(b);
    });
  }
  function bindMapButtons(root) {
    root.querySelectorAll("[data-map]").forEach((b) => b.addEventListener("click", () => focusPlace(b.dataset.map, true)));
  }

  function renderStatic() {
    $("#museumCards").innerHTML = idsBy((p) => p.cat === "museum").map(card).join("");
    $("#extraCards").innerHTML = EXTRA_IDS.map(card).join("");
    $("#dishes").innerHTML = DISHES.map((d) =>
      `<div class="dish"><b>${esc(d.name)}</b><small>${esc(d.en)}</small><p>${esc(d.note)}</p></div>`).join("");
    bindMapButtons($("#museumCards"));
    bindMapButtons($("#extraCards"));
  }

  // ---------- map ----------
  const map = L.map("mapEl", { scrollWheelZoom: false }).setView([46.5197, 6.6323], 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19, attribution: "© OpenStreetMap contributors",
  }).addTo(map);
  map.on("focus", () => map.scrollWheelZoom.enable());
  map.on("blur", () => map.scrollWheelZoom.disable());

  const markers = {};
  const layer = L.layerGroup().addTo(map);
  const activeCats = new Set(Object.keys(CATS));
  let dayFilter = 0;
  let here = null;

  const dist = (a, b) => {
    const R = 6371, r = Math.PI / 180;
    const dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  };

  function pin(html, color) {
    return L.divIcon({ className: "pin", html: `<span style="background:${color}">${html}</span>`, iconSize: [34, 34], iconAnchor: [17, 17], popupAnchor: [0, -16] });
  }
  function popup(id) {
    const p = PLACES[id];
    return `<div class="pop"><b>${esc(p.name)}</b><p>${esc(p.desc)}</p><p>🎟️ ${esc(p.price)}</p>
      <a href="${dirUrl(p)}" target="_blank" rel="noopener">Directions</a> · <a href="${esc(p.url)}" target="_blank" rel="noopener">Official site</a></div>`;
  }

  function visibleIds() {
    if (dayFilter) return DAYS.find((d) => d.id === dayFilter).stops.map((s) => s.place);
    return Object.keys(PLACES).filter((id) => activeCats.has(PLACES[id].cat));
  }

  function renderMap() {
    layer.clearLayers();
    const ids = visibleIds();
    const bounds = [];
    ids.forEach((id) => {
      const p = PLACES[id];
      const stopIndex = dayFilter ? DAYS.find((d) => d.id === dayFilter).stops.findIndex((s) => s.place === id) + 1 : 0;
      const m = L.marker([p.lat, p.lng], {
        icon: stopIndex ? pin(String(stopIndex), DAYS[dayFilter - 1].color) : pin(CATS[p.cat].icon, CATS[p.cat].color),
        title: p.name, keyboard: true,
      }).bindPopup(popup(id)).addTo(layer);
      markers[id] = m;
      bounds.push([p.lat, p.lng]);
    });
    if (dayFilter) {
      const d = DAYS.find((x) => x.id === dayFilter);
      L.polyline(d.stops.map((s) => [PLACES[s.place].lat, PLACES[s.place].lng]), { color: d.color, weight: 4, opacity: 0.8, dashArray: "8 6" }).addTo(layer);
    }
    if (here) L.circleMarker([here.lat, here.lng], { radius: 8, color: "#fff", weight: 3, fillColor: "#0b5d8a", fillOpacity: 1 }).bindTooltip("You are here").addTo(layer);
    if (bounds.length) map.fitBounds(bounds, { padding: [30, 30], maxZoom: 15 });
    renderList(ids);
  }

  function renderList(ids) {
    const list = $("#placeList");
    let items = ids.map((id) => ({ id, p: PLACES[id], d: here ? dist(here, PLACES[id]) : null }));
    if (here) items.sort((a, b) => a.d - b.d);
    list.innerHTML = items.map(({ id, p, d }) =>
      `<li><button type="button" data-id="${id}"><span class="dot" style="background:${CATS[p.cat].color}">${CATS[p.cat].icon}</span>
        <span><b>${esc(p.name)}</b><small>${CATS[p.cat].label}${d != null ? ` · ${d < 1 ? Math.round(d * 1000) + " m" : d.toFixed(1) + " km"} away` : ""}</small></span></button></li>`).join("");
    list.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => focusPlace(b.dataset.id, false)));
  }

  function focusPlace(id, scroll) {
    const p = PLACES[id];
    if (!markers[id]) { dayFilter = 0; activeCats.add(p.cat); syncFilters(); renderMap(); }
    if (scroll) $("#map").scrollIntoView({ behavior: "smooth", block: "start" });
    map.flyTo([p.lat, p.lng], 16, { duration: 0.8 });
    setTimeout(() => markers[id] && markers[id].openPopup(), 850);
  }

  function syncFilters() {
    const cf = $("#catFilters");
    cf.innerHTML = "";
    Object.entries(CATS).forEach(([k, c]) => {
      const b = el("button", { type: "button", class: "chip" + (!dayFilter && activeCats.has(k) ? " on" : ""), style: `--c:${c.color}` }, `${c.icon} ${c.label}`);
      b.addEventListener("click", () => {
        dayFilter = 0;
        activeCats.has(k) ? activeCats.delete(k) : activeCats.add(k);
        if (!activeCats.size) Object.keys(CATS).forEach((x) => activeCats.add(x));
        syncFilters(); renderMap();
      });
      cf.appendChild(b);
    });
    const df = $("#dayFilters");
    df.innerHTML = "";
    DAYS.forEach((d) => {
      const b = el("button", { type: "button", class: "chip" + (dayFilter === d.id ? " on" : ""), style: `--c:${d.color}` }, `${d.emoji} Day ${d.id} route`);
      b.addEventListener("click", () => { dayFilter = dayFilter === d.id ? 0 : d.id; syncFilters(); renderMap(); });
      df.appendChild(b);
    });
  }

  $("#nearMe").addEventListener("click", (e) => {
    const btn = e.currentTarget;
    if (!navigator.geolocation) { btn.textContent = "📍 Not supported"; return; }
    btn.textContent = "📍 Locating…";
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        here = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        btn.textContent = "📍 Near me ✓";
        dayFilter = 0;
        renderMap();
        if (dist(here, { lat: 46.5197, lng: 6.6323 }) > 25) btn.textContent = "📍 You're far from Lausanne";
        else map.setView([here.lat, here.lng], 15);
      },
      () => { btn.textContent = "📍 Location blocked"; },
      { enableHighAccuracy: false, timeout: 10000 });
  });

  // ---------- weather ----------
  const WX = [
    [[0], "☀️", "Clear"], [[1, 2], "🌤️", "Mostly sunny"], [[3], "☁️", "Cloudy"], [[45, 48], "🌫️", "Fog"],
    [[51, 53, 55, 56, 57], "🌦️", "Drizzle"], [[61, 63, 65, 66, 67, 80, 81, 82], "🌧️", "Rain"],
    [[71, 73, 75, 77, 85, 86], "🌨️", "Snow"], [[95, 96, 99], "⛈️", "Thunderstorm"],
  ];
  const wx = (c) => { const m = WX.find(([codes]) => codes.includes(c)); return m ? { icon: m[1], text: m[2] } : { icon: "🌡️", text: "—" }; };

  async function loadWeather() {
    const card = $("#weatherCard");
    try {
      const url = "https://api.open-meteo.com/v1/forecast?latitude=46.5197&longitude=6.6323&current=temperature_2m,weather_code" +
        "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Europe%2FZurich&forecast_days=3";
      const r = await fetch(url);
      if (!r.ok) throw new Error(r.status);
      const j = await r.json();
      const now = wx(j.current.weather_code);
      const days = j.daily.time.map((t, i) => {
        const w = wx(j.daily.weather_code[i]);
        const label = new Date(t + "T12:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
        return { label, w, hi: Math.round(j.daily.temperature_2m_max[i]), lo: Math.round(j.daily.temperature_2m_min[i]), rain: j.daily.precipitation_probability_max[i] };
      });
      const best = days.reduce((a, b) => (b.rain < a.rain ? b : a));
      const wet = days.filter((d) => d.rain >= 60);
      let advice = `Driest of the next 3 days: <b>${best.label}</b> (${best.rain}% chance of rain) — good for the vineyard walk (Day 3).`;
      if (wet.length) advice += ` Rain likely on ${wet.map((d) => d.label).join(", ")}: use each day's ☔ rain plan.`;
      card.innerHTML = `
        <h2>Weather in Lausanne</h2>
        <div class="wx-now"><span class="wx-big">${now.icon}</span><div><b>${Math.round(j.current.temperature_2m)}°C</b><small>${now.text} right now</small></div></div>
        <div class="wx-days">${days.map((d) => `<div class="wx-day"><b>${d.label}</b><span>${d.w.icon}</span><small>${d.lo}° / ${d.hi}°</small><small>💧 ${d.rain}%</small></div>`).join("")}</div>
        <p class="wx-advice">${advice}</p>`;
    } catch {
      card.innerHTML = `<h2>Weather in Lausanne</h2><p class="muted">Live forecast unavailable. Check <a href="https://www.meteoswiss.admin.ch/">MeteoSwiss</a> before you head out.</p>`;
    }
  }

  // ---------- tips ----------
  const TIPS = [
    ["🚇", "Getting around", "The city is small but steep. Use the m2 metro to link the lake (Ouchy), the station and the centre. The m1 runs west to Vidy and the EPFL university. Overnight hotel guests normally get a free Lausanne Transport Card — ask when you check in."],
    ["👟", "Wear good shoes", "Lausanne is built on hills and the Old Town has stairs and cobbles. Comfortable shoes matter more than anything else you pack."],
    ["💳", "Money", "Swiss franc (CHF). Cards and contactless work almost everywhere. Prices are high: lunch menus ('plat du jour') are the cheapest way to eat well."],
    ["🕐", "Opening times", "Many shops close on Sunday. Most museums are open Sunday but close one day a week (often Monday or Tuesday). Always check the official link."],
    ["💧", "Free drinking water", "Tap water is excellent, and public fountains across the city are safe to drink from. Bring a bottle."],
    ["🌦️", "Weather", "The lake keeps things mild, but it can rain suddenly. Bring a light layer and an umbrella, even in summer."],
    ["🗣️", "Language", "French is spoken. English is widely understood in hotels, restaurants and museums, but a 'Bonjour' goes a long way."],
    ["🚆", "Day trips", "Trains are punctual. Geneva is ≈ 40 minutes away; Montreux and Vevey about 25. The Swiss Travel Pass can pay off if you plan lots of trips."],
    ["🆘", "Emergencies", "112 (general), 117 police, 118 fire, 144 ambulance."],
  ];
  $("#tipGrid").innerHTML = TIPS.map(([i, t, d]) => `<div class="tipcard"><span>${i}</span><h3>${t}</h3><p>${d}</p></div>`).join("");

  // ---------- budget ----------
  let style = store.get("style", "mid");
  function renderBudget() {
    const box = $("#budgetStyle");
    box.innerHTML = "";
    [["budget", "Budget"], ["mid", "Comfortable"], ["splurge", "Splurge"]].forEach(([k, label]) => {
      const b = el("button", { type: "button", class: "chip" + (style === k ? " on" : "") }, label);
      b.addEventListener("click", () => { style = k; store.set("style", k); renderBudget(); });
      box.appendChild(b);
    });
    const days = +$("#daysRange").value, trav = +$("#travRange").value;
    $("#daysVal").textContent = days; $("#travVal").textContent = trav;
    const f = BUDGET.food[style], s = BUDGET.sights[style], m = BUDGET.move[style];
    const per = (f + s + m) * days;
    $("#budgetOut").innerHTML = `
      <div class="line"><span>🍽️ Food</span><b>CHF ${f * days}</b></div>
      <div class="line"><span>🎟️ Sights &amp; museums</span><b>CHF ${s * days}</b></div>
      <div class="line"><span>🚇 Transport</span><b>CHF ${m * days}</b></div>
      <div class="line total"><span>Per person</span><b>CHF ${per}</b></div>
      <div class="line total"><span>For ${trav} traveller${trav > 1 ? "s" : ""}</span><b>CHF ${per * trav}</b></div>
      <p class="muted small">Rough estimate. Hotel and long-distance trains not included.</p>`;
  }
  $("#daysRange").addEventListener("input", renderBudget);
  $("#travRange").addEventListener("input", renderBudget);

  // ---------- phrases ----------
  $("#phrases").innerHTML = PHRASES.map((p, i) =>
    `<li><button type="button" class="ph" data-i="${i}"><b>${esc(p.fr)}</b><small>${esc(p.en)}</small></button>
     <button type="button" class="say" data-i="${i}" aria-label="Hear: ${esc(p.fr)}">🔊</button></li>`).join("");
  $("#phrases").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    const p = PHRASES[+b.dataset.i];
    if (b.classList.contains("say")) {
      if ("speechSynthesis" in window) {
        const u = new SpeechSynthesisUtterance(p.fr);
        u.lang = "fr-FR"; u.rate = 0.9;
        speechSynthesis.cancel(); speechSynthesis.speak(u);
      }
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(p.fr).then(() => {
        const old = b.querySelector("small").textContent;
        b.querySelector("small").textContent = "Copied ✓";
        setTimeout(() => (b.querySelector("small").textContent = old), 1200);
      }).catch(() => {});
    }
  });

  // ---------- footer actions ----------
  $("#printBtn").addEventListener("click", () => window.print());
  $("#resetBtn").addEventListener("click", () => {
    if (!confirm("Clear all ticked stops?")) return;
    done.clear(); store.set("done", []); renderDay();
  });

  // ---------- init ----------
  renderTabs();
  renderDay();
  renderStatic();
  renderPriceFilters();
  renderFood();
  syncFilters();
  renderMap();
  renderBudget();
  loadWeather();
})();
