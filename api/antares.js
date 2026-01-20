export default async function handler(req, res) {
  const ACCESS_KEY = process.env.ANTARES_KEY;

  if (!ACCESS_KEY) {
    return res.status(500).json({ error: "ANTARES_KEY missing" });
  }

  const lokasi = req.query.lokasi || "EWSPalaran";
  const type   = req.query.type || "latest";

  // 🔒 whitelist lokasi (WAJIB)
  const allowedLokasi = ["EWSPalaran", "EWSSangaSanga"];
  if (!allowedLokasi.includes(lokasi)) {
    return res.status(400).json({ error: "Lokasi tidak valid" });
  }

  const baseUrl = `https://platform.antares.id:8443/~/antares-cse/antares-id/EWSSamarinda/${lokasi}`;

  try {
    if (type === "latest") {
      const r = await fetch(`${baseUrl}/la`, {
        headers: {
          "X-M2M-Origin": ACCESS_KEY,
          "Accept": "application/json"
        }
      });

      const data = await r.json();
      const cin  = data?.["m2m:cin"];
      const con  = JSON.parse(cin?.con || "{}");

      return res.json({
        kelembapan: Number(con.kelembapan),
        getaran: Number(con.getaran).toFixed(2),
        kemiringan: Number(con.kemiringan).toFixed(2),
        potensi: con.potensi || "Tidak Diketahui",
        waktu: cin?.ct
      });
    }

    if (type === "all") {
      const r = await fetch(`${baseUrl}?fu=1&drt=2&ty=4`, {
        headers: {
          "X-M2M-Origin": ACCESS_KEY,
          "Accept": "application/json"
        }
      });

      const data = await r.json();
      const list = (data["m2m:list"] || []).map(item => {
        const cin = item["m2m:cin"];
        const con = JSON.parse(cin.con || "{}");
        return {
          kelembapan: Number(con.kelembapan),
          getaran: Number(con.getaran).toFixed(2),
          kemiringan: Number(con.kemiringan).toFixed(2),
          potensi: con.potensi || "Tidak Diketahui",
          waktu: cin.ct
        };
      }).sort((a, b) => b.waktu.localeCompare(a.waktu));

      return res.json(list);
    }

    return res.status(400).json({ error: "type tidak dikenali" });

  } catch (err) {
    return res.status(500).json({ error: "Gagal ambil data Antares" });
  }
}