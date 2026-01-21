let table;
// ========================================
// CHART
// ========================================
let chart;

let lastHistoryData = [];

// Ambil lokasi dari localStorage
const lokasiAktif = localStorage.getItem("ews_location") || "EWSPalaran";

const LOCATIONS = {
  EWSPalaran: "EWS Kecamatan Palaran",
  EWSSambutan: "EWS Kecamatan Sambutan",
};

const locationName = document.getElementById("locationName");

if (!LOCATIONS[lokasiAktif]) {
  lokasiAktif = "EWSPalaran";
  localStorage.setItem("ews_location", lokasiAktif);
}

// ====== RENDER ======
function renderHeader() {
  locationName.textContent = LOCATIONS[lokasiAktif];
}

// Aktifkan tombol chart
document.querySelectorAll(".chart-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    // Hapus active dari semua tombol
    document
      .querySelectorAll(".chart-btn")
      .forEach((b) => b.classList.remove("active"));

    // Tambah active ke tombol yang diklik
    btn.classList.add("active");

    // Update Chart
    const tipe = btn.dataset.chart;
    if (lastHistoryData.length > 0) {
      updateChart(lastHistoryData, tipe);
    }
  });
});

function updateChart(historyData, tipe) {
  const labels = historyData.map((item) => antaresToLocalDate(item.waktu));

  let datasetLabel = "";
  let datasetData = [];
  let lineColor = "";

  if (tipe === "kemiringan") {
    datasetLabel = "Kemiringan Tanah (°)";
    datasetData = historyData.map((i) => Number(i.kemiringan));
    lineColor = "red";
  } else if (tipe === "getaran") {
    datasetLabel = "Getaran (m/s²)";
    datasetData = historyData.map((i) => Number(i.getaran));
    lineColor = "blue";
  } else if (tipe === "kelembapan") {
    datasetLabel = "Kelembapan (%)";
    datasetData = historyData.map((i) => Number(i.kelembapan));
    lineColor = "green";
  }

  const ctx = document.getElementById("chartCanvas").getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: datasetLabel,
          data: datasetData,
          borderColor: lineColor,
          borderWidth: 2,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10,
          },
        },
        y: { beginAtZero: false },
      },
    },
  });
}

// ---------------------------
// Ambil data & update tabel
// ---------------------------
async function getDataHistory() {
  try {
    const res = await fetch(`/api/antares?type=all&lokasi=${lokasiAktif}`);
    const historyData = await res.json();

    if (!Array.isArray(historyData) || historyData.length === 0) {
      console.warn("Data history kosong");
      return;
    }

    // Urutkan data dari terbaru → terlama
    historyData.sort(
      (a, b) => antaresToLocalDate(b.waktu) - antaresToLocalDate(a.waktu),
    );

    // Update teks "Diperbarui X detik lalu"
    document.getElementById("last-update").textContent = hitungWaktuLalu(
      historyData[0].waktu,
    );

    const tableData = historyData.map((item) => {
      const dateObj = antaresToLocalDate(item.waktu);

      return [
        {
          display: formatWaktuLokal(item.waktu),
          sort: dateObj ? dateObj.getTime() : 0,
        },
        `${item.kemiringan}°`,
        `${item.getaran} m/s²`,
        `${item.kelembapan}%`,
        item.potensi,
      ];
    });

    if ($.fn.dataTable.isDataTable("#history-table")) {
      table.destroy();
    }

    table = $("#history-table").DataTable({
      data: tableData,
      destroy: true,
      pageLength: 10,
      lengthMenu: [5, 10, 25, 50, 100],
      scrollX: true,
      autoWidth: false,
      order: [[0, "desc"]],
      columnDefs: [
        {
          targets: 0,
          render: {
            _: "display",
            sort: "sort",
          },
        },
      ],
      language: {
        lengthMenu: "Tampilkan _MENU_ data per halaman",
        zeroRecords: "Tidak ada data ditemukan",
        info: "Menampilkan _START_ - _END_ dari _TOTAL_ data",
        infoEmpty: "Menampilkan 0 sampai 0 dari 0 data",
        infoFiltered: "(difilter dari total _MAX_ data)",
        search: "Cari",
        paginate: {
          first: "Pertama",
          last: "Terakhir",
          next: "Berikutnya",
          previous: "Sebelumnya",
        },
      },
    });

    const chartData = historyData.slice(0, 30);
    lastHistoryData = chartData;
    document.querySelector('[data-chart="kemiringan"]').classList.add("active");
    updateChart(chartData, "kemiringan");
  } catch (err) {
    console.error("Gagal mengambil data riwayat:", err);
  }
}

// Load awal
getDataHistory();
renderHeader();

// Auto reload tiap 1 Menit
setInterval(getDataHistory, 60000);
