const LOCATIONS = {
  EWSPalaran: "EWS Kecamatan Palaran",
  EWSSambutan: "EWS Kecamatan Sambutan",
};

const locationName = document.getElementById("locationName");
const swapBtn = document.getElementById("swapLocation");
const lastUpdate = document.getElementById("lastupdate");

// ====== INIT STATE ======
let currentLocation = localStorage.getItem("ews_location");

if (!LOCATIONS[currentLocation]) {
  currentLocation = "EWSPalaran";
  localStorage.setItem("ews_location", currentLocation);
}

// ====== RENDER ======
function renderHeader() {
  locationName.textContent = LOCATIONS[currentLocation];
}

// ====== SWITCH LOCATION ======
swapBtn.onclick = () => {
  currentLocation =
    currentLocation === "EWSPalaran" ? "EWSSambutan" : "EWSPalaran";

  localStorage.setItem("ews_location", currentLocation);
  renderHeader();
  getData();

  if (typeof getDataHistory === "function") {
    getDataHistory();
  }
};

// ====== FETCH DATA ======
async function getData() {
  try {
    const res = await fetch(
      `/api/antares?lokasi=${currentLocation}&type=latest`,
    );
    const data = await res.json();

    if (!data || !data.waktu) {
      console.warn("Data kosong / tidak valid");
      return;
    }

    document.getElementById("kelembapan").textContent = data.kelembapan;
    document.getElementById("getaran").textContent = data.getaran;
    document.getElementById("kemiringan").textContent = data.kemiringan;

    // ---- KATEGORI ----
    document.getElementById("kelembapan-text").textContent =
      data.kelembapan <= 50
        ? "Kering"
        : data.kelembapan < 70
          ? "Lembap"
          : "Basah";

    document.getElementById("kemiringan-text").textContent =
      data.kemiringan <= 4
        ? "Landai"
        : data.kemiringan < 17
          ? "Sedang"
          : "Curam";

    document.getElementById("getaran-text").textContent =
      data.getaran <= 0.126
        ? "Rendah"
        : data.getaran < 0.501
          ? "Sedang"
          : "Tinggi";

    document.getElementById("lastupdate").textContent = hitungWaktuLalu(
      data.waktu,
    );

    updateRiskIndicator(data.potensi);
  } catch (err) {
    console.error("Gagal mengambil data:", err);
  }
}

// ====== RISK INDICATOR ======
function updateRiskIndicator(potensi) {
  const levels = ["low", "medium", "high"];

  levels.forEach((level) => {
    document.querySelector(`.risk-${level} .${level}-checked`).style.display =
      "none";
    document.querySelector(`.risk-${level} .${level}-unchecked`).style.display =
      "block";
  });

  if (potensi === "Rendah") toggleRisk("low");
  else if (potensi === "Sedang") toggleRisk("medium");
  else if (potensi === "Tinggi") toggleRisk("high");
}

function toggleRisk(level) {
  document.querySelector(`.risk-${level} .${level}-checked`).style.display =
    "block";
  document.querySelector(`.risk-${level} .${level}-unchecked`).style.display =
    "none";
}

// ====== INIT ======
renderHeader();
getData();
setInterval(getData, 5000);
