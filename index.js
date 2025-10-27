

document.addEventListener("DOMContentLoaded", init);

function init() {
  const api =
    "https://developer.nps.gov/api/v1/parks?api_key=1A1ysntfoonKKUeUWGZEkhfdQacwcXmb9kedUFy4";

  const container = document.getElementById("container");
  const label = document.getElementById("label");
  const stateSelect = document.getElementById("state-select");
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");
  const resetBtn = document.getElementById("reset-btn");
  const bucketToggle = document.getElementById("bucketToggle");
  const bucketList = document.getElementById("bucketList");
  const closeBucket = document.getElementById("closeBucket");
  const clearBucket = document.getElementById("clearBucket");
  const bucketContainer = document.getElementById("bucketContainer");

  const visitedProgress = document.getElementById("visited-progress");
  const visitedCountEl = document.getElementById("visited-count");
  const progressBar = document.getElementById("progress-bar");

  let globalData = [];
  let parkMarkers = [];
  let map;
  let visitedParks = JSON.parse(localStorage.getItem("visitedParks")) || [];
  let bucketParks = JSON.parse(localStorage.getItem("bucketParks")) || [];

  
  const yellowIcon = L.icon({
    iconUrl:
      "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-yellow.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const blueIcon = L.icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  fetch(api)
    .then((r) => r.json())
    .then((json) => {
      globalData = json.data.filter((p) => p.latitude && p.longitude);
      renderParks(globalData.slice(0, 30));
      initializeMap();
      addParkPins(globalData);
      updateVisitedCount();
    });

  function renderParks(data) {
    container.innerHTML = "";
    data.forEach((park) => createCard(park, container));
  }

  function createCard(park, target) {
    const card = document.createElement("div");
    card.className = "card hvr-grow-shadow";

    const img = document.createElement("img");
    img.src = park.images?.[0]?.url || "";
    img.className = "card-image";
    img.alt = park.fullName;
    img.addEventListener("click", () => showParkInfo(park));
    card.appendChild(img);

    const body = document.createElement("div");
    body.className = "card-body";
    body.innerHTML = `<h5 class="card-title">${park.fullName}</h5>
      <p class="card-subtitle">${park.states}</p>`;
    card.appendChild(body);

    const like = document.createElement("span");
    like.className = "fa fa-star like-btn";
    like.innerHTML = "&#9733;";
    if (bucketParks.includes(park.id)) like.style.color = "gold";
    like.addEventListener("click", (e) => toggleBucket(e, park));
    card.appendChild(like);

    target.appendChild(card);
  }

  function showParkInfo(park) {
    const modalTitle = document.getElementById("parkInfoTitle");
    const modalBody = document.getElementById("parkInfoBody");
    modalTitle.textContent = park.fullName;

    const hours = park.operatingHours?.[0]?.standardHours;
    const hoursText = hours
      ? `<p><strong>Operating Hours:</strong><br>
        Monday: ${hours.monday}<br>
        Tuesday: ${hours.tuesday}<br>
        Wednesday: ${hours.wednesday}<br>
        Thursday: ${hours.thursday}<br>
        Friday: ${hours.friday}<br>
        Saturday: ${hours.saturday}<br>
        Sunday: ${hours.sunday}</p>`
      : `<p><strong>Operating Hours:</strong> Not available</p>`;

    const imagesHTML = park.images?.length
      ? `<div class="row">${park.images
          .slice(0, 4)
          .map(
            (img) => `
            <div class="col-md-6 mb-2">
              <img src="${img.url}" class="img-fluid rounded" alt="${img.altText || park.fullName}">
            </div>`
          )
          .join("")}</div>`
      : `<p><em>No images available for this park.</em></p>`;

    const mapBtn =
      park.latitude && park.longitude
        ? `<button id="viewOnMapBtn" class="btn btn-success mt-3">📍 View on Map</button>`
        : "";

    modalBody.innerHTML = `
      ${imagesHTML}
      <p><strong>Description:</strong> ${park.description || "No description available."}</p>
      <p><strong>Weather Info:</strong> ${park.weatherInfo || "Not available."}</p>
      ${hoursText}
      <p><strong>Activities:</strong> ${
        park.activities?.map((a) => a.name).join(", ") || "N/A"
      }</p>
      ${mapBtn}`;

    $("#parkInfoModal").modal("show");

    setTimeout(() => {
      const mapBtnEl = document.getElementById("viewOnMapBtn");
      if (mapBtnEl)
        mapBtnEl.addEventListener("click", () => {
          $("#parkInfoModal").modal("hide");
          focusMapOnPark(park);
        });
    }, 100);
  }

  function initializeMap() {
    map = L.map("map").setView([39.5, -98.35], 4);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);
  }

  function addParkPins(parks) {
    parks.forEach((park) => {
      const lat = parseFloat(park.latitude);
      const lon = parseFloat(park.longitude);
      const isVisited = visitedParks.includes(park.id);
      const marker = L.marker([lat, lon], {
        icon: isVisited ? yellowIcon : blueIcon,
      }).addTo(map);
      marker.bindPopup(`<b>${park.fullName}</b><br>${park.states}`);
      marker.on("click", () => toggleVisited(park, marker));
      parkMarkers.push(marker);
    });
  }

  function toggleVisited(park, marker) {
    const idx = visitedParks.indexOf(park.id);
    if (idx === -1) {
      visitedParks.push(park.id);
      marker.setIcon(yellowIcon);
    } else {
      visitedParks.splice(idx, 1);
      marker.setIcon(blueIcon);
    }
    localStorage.setItem("visitedParks", JSON.stringify(visitedParks));
    updateVisitedCount();
  }

  function updateVisitedCount() {
    const total = globalData.length;
    const count = visitedParks.length;
    visitedCountEl.style.opacity = 0;
    setTimeout(() => {
      visitedCountEl.textContent =
        count === 0
          ? "🏕️ You haven’t marked any parks as visited yet!"
          : `🏕️ You’ve visited ${count} of ${total} park${
              count !== 1 ? "s" : ""
            }!`;
      visitedCountEl.style.opacity = 1;
    }, 200);

    const percent = total > 0 ? (count / total) * 100 : 0;
    progressBar.style.width = `${percent}%`;
    progressBar.style.background =
      percent < 25
        ? "linear-gradient(90deg, #e46b6b, #ffb347)"
        : percent < 60
        ? "linear-gradient(90deg, #ffb347, #ffe66d)"
        : "linear-gradient(90deg, #5ab09b, #3b8f7c)";
  }

  function focusMapOnPark(park) {
    if (!map) return;
    const lat = parseFloat(park.latitude);
    const lon = parseFloat(park.longitude);
    document
      .getElementById("map-section")
      .scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      map.setView([lat, lon], 8);
      const marker = parkMarkers.find((m) => {
        const pos = m.getLatLng();
        return (
          Math.abs(pos.lat - lat) < 0.001 && Math.abs(pos.lng - lon) < 0.001
        );
      });
      if (marker) {
        marker.openPopup();
        marker.setBouncingOptions({ bounceHeight: 10, bounceSpeed: 60 });
        marker.bounce(1);
      }
    }, 800);
  }

  function toggleBucket(e, park) {
    e.stopPropagation();
    const idx = bucketParks.indexOf(park.id);
    if (idx === -1) {
      bucketParks.push(park.id);
      e.target.style.color = "gold";
    } else {
      bucketParks.splice(idx, 1);
      e.target.style.color = "#ccc";
    }
    localStorage.setItem("bucketParks", JSON.stringify(bucketParks));
    renderBucket();
  }

  function renderBucket() {
    bucketContainer.innerHTML = "";
    const saved = globalData.filter((p) => bucketParks.includes(p.id));
    saved.forEach((p) => {
      const card = document.createElement("div");
      card.className = "visited-summary-card";
      card.innerHTML = `
        <img src="${p.images?.[0]?.url || ""}" alt="${p.fullName}">
        <h6>${p.fullName}</h6>
        <p class="text-muted small">${p.states}</p>`;
      card.addEventListener("click", () => {
        bucketList.classList.remove("open");
        focusMapOnPark(p);
      });
      bucketContainer.appendChild(card);
    });
  }

  bucketToggle.addEventListener("click", () => {
    bucketList.classList.add("open");
    renderBucket();
  });
  closeBucket.addEventListener("click", () =>
    bucketList.classList.remove("open")
  );
  clearBucket.addEventListener("click", () => {
    bucketParks = [];
    localStorage.removeItem("bucketParks");
    renderBucket();
  });

  visitedProgress.addEventListener("click", openVisitedSummary);

  function openVisitedSummary() {
    const modalBody = document.getElementById("visitedSummaryBody");
    modalBody.innerHTML = "";
    if (visitedParks.length === 0) {
      modalBody.innerHTML = `<p class="text-muted">You haven’t marked any parks as visited yet!</p>`;
      $("#visitedSummaryModal").modal("show");
      return;
    }
    const visitedData = globalData.filter((p) =>
      visitedParks.includes(p.id)
    );
    visitedData.forEach((park) => {
      const card = document.createElement("div");
      card.className = "visited-summary-card";
      card.innerHTML = `
        <img src="${park.images?.[0]?.url || ""}" alt="${park.fullName}">
        <h6>${park.fullName}</h6>
        <p class="text-muted small">${park.states}</p>`;
      card.addEventListener("click", () => {
        $("#visitedSummaryModal").modal("hide");
        focusMapOnPark(park);
      });
      modalBody.appendChild(card);
    });
    $("#visitedSummaryModal").modal("show");
  }

  
  searchBtn.addEventListener("click", () => {
    const state = stateSelect.value.trim();
    const query = searchInput.value.toLowerCase();
    const checked = Array.from(
      document.querySelectorAll("#activity-filters input:checked")
    ).map((i) => i.id);
    let filtered = [...globalData];
    if (state) filtered = filtered.filter((p) => p.states.includes(state));
    if (query)
      filtered = filtered.filter((p) =>
        p.fullName.toLowerCase().includes(query)
      );
    if (checked.length)
      filtered = filtered.filter((p) =>
        p.activities.some((a) =>
          checked.some((c) =>
            a.name.toLowerCase().includes(c.toLowerCase())
          )
        )
      );
    label.textContent = `Results: ${filtered.length}`;
    renderParks(filtered.slice(0, 30));
  });

  resetBtn.addEventListener("click", () => {
    stateSelect.value = "";
    searchInput.value = "";
    document
      .querySelectorAll("#activity-filters input")
      .forEach((i) => (i.checked = false));
    renderParks(globalData.slice(0, 30));
    label.textContent = "Top Parks";
  });
}