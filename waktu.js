function antaresToLocalDate(ct) {
    if (!ct) return null;

    // Antares ct → ISO UTC
    const iso = ct.replace(
        /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/,
        "$1-$2-$3T$4:$5:$6Z"
    );

    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
}

function formatWaktuLokal(ct) {
    const d = antaresToLocalDate(ct);
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

function hitungWaktuLalu(ct) {
    const d = antaresToLocalDate(ct);
    if (!d) return "-";

    const selisih = Math.floor((Date.now() - d.getTime()) / 1000);

    if (selisih < 60) return `Diperbarui ${selisih} detik lalu`;
    if (selisih < 3600) return `Diperbarui ${Math.floor(selisih / 60)} menit lalu`;
    if (selisih < 86400) return `Diperbarui ${Math.floor(selisih / 3600)} jam lalu`;
    return `Diperbarui ${Math.floor(selisih / 86400)} hari lalu`;
}
