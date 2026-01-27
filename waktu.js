// ===================================
// Parsing waktu Antares (LOCAL TIME)
// ===================================
function parseAntaresTime(ct) {
    if (!ct || ct.length < 15) return null;

    const year = Number(ct.slice(0, 4));
    const month = Number(ct.slice(4, 6)) - 1;
    const day = Number(ct.slice(6, 8));
    const hour = Number(ct.slice(9, 11));
    const minute = Number(ct.slice(11, 13));
    const second = Number(ct.slice(13, 15));

    return new Date(year, month, day, hour, minute, second);
}

// ===================================
// Format untuk tampilan (UI)
// ===================================
function formatWaktuLokal(ct) {
    const d = parseAntaresTime(ct);
    if (!d) return "-";

    return d.toLocaleString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

// ===================================
// Hitung "X waktu lalu"
// ===================================
function hitungWaktuLalu(ct) {
    const d = parseAntaresTime(ct);
    if (!d) return "-";

    const diff = Math.floor((Date.now() - d.getTime()) / 1000);

    if (diff < 60) return `Diperbarui ${diff} detik lalu`;
    if (diff < 3600) return `Diperbarui ${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `Diperbarui ${Math.floor(diff / 3600)} jam lalu`;
    return `Diperbarui ${Math.floor(diff / 86400)} hari lalu`;
}