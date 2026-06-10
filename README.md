# 🚨 Early Warning System Bencana Tanah Longsor Samarinda

Sistem Peringatan Dini untuk memantau potensi tanah longsor di Kota Samarinda menggunakan sensor IoT yang terhubung ke platform Antares.

## 📋 Fitur

- **Monitoring Real-time**: Pantau kemiringan tanah, getaran, dan kelembapan tanah secara real-time
- **Multi Lokasi**: Mendukung 2 lokasi (EWS Palaran & EWS Sambutan)
- **Indikator Potensi Longsor**: Klasifikasi otomatis (Rendah/Sedang/Tinggi)
- **Riwayat Data**: Tabel data historis dengan sorting dan search
- **Visualisasi Chart**: Grafik interaktif untuk melihat tren data
- **Integrasi Telegram**: Bot Telegram terpisah untuk setiap lokasi
- **Auto-refresh**: Data diperbarui otomatis setiap 5 detik (dashboard) / 1 menit (history)
- **Responsive Design**: Dapat diakses dari desktop maupun mobile

## 🛠️ Teknologi

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Charts**: Chart.js
- **Tables**: jQuery DataTables
- **Backend**: Vercel Serverless Functions
- **IoT Platform**: Antares IoT
- **Sensors**: MPU6050 (getaran & kemiringan), SEN0308 (kelembapan tanah)

## 📁 Struktur Project

```
EWSSamarinda/
├── index.html          # Dashboard utama
├── history.html        # Halaman riwayat data
├── script.js           # Logic dashboard
├── history.js          # Logic history & chart
├── waktu.js            # Helper untuk parsing waktu
├── style.css           # Styling responsive
├── api/
│   └── antares.js      # Serverless function untuk Antares API
├── package.json        # Dependencies
├── vercel.json         # Konfigurasi Vercel
├── .env.example        # Template environment variables
└── README.md           # Dokumentasi
```

## 🚀 Cara Deploy ke Vercel

### 1. Persiapan

```bash
# Clone repository
git clone https://github.com/ewsprivate/EWSSamarinda.git
cd EWSSamarinda

# Install dependencies (opsional, untuk development)
npm install
```

### 2. Setup Environment Variables

Buat file `.env` di root project:

```bash
cp .env.example .env
```

Edit `.env` dan isi dengan API key Antares Anda:

```
ANTARES_KEY=your_antares_access_key_here
```

**Catatan**: File `.env` tidak akan ter-commit ke git (sudah ada di .gitignore)

### 3. Deploy ke Vercel

#### Opsi A: Melalui Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login ke Vercel
vercel login

# Deploy
vercel

# Untuk production deployment
vercel --prod
```

#### Opsi B: Melalui Vercel Dashboard

1. Buka [vercel.com](https://vercel.com) dan login
2. Klik "New Project"
3. Import repository dari GitHub
4. Tambahkan Environment Variable:
   - Key: `ANTARES_KEY`
   - Value: [Your Antares API Key]
5. Klik "Deploy"

### 4. Setup Environment Variables di Vercel

Setelah deploy, tambahkan environment variable di Vercel Dashboard:

1. Buka project di Vercel Dashboard
2. Pergi ke **Settings** → **Environment Variables**
3. Tambahkan:
   - **Key**: `ANTARES_KEY`
   - **Value**: API key dari Antares
   - **Environment**: Production, Preview, Development (pilih semua)
4. Klik **Save**

### 5. Redeploy (jika perlu)

Jika environment variable ditambahkan setelah deployment pertama:

```bash
vercel --prod
```

Atau melalui dashboard: **Deployments** → klik titik 3 → **Redeploy**

## 🔧 Konfigurasi

### Telegram Bot URLs

Edit link bot Telegram untuk setiap lokasi di `script.js` dan `history.js`:

```javascript
const LOCATIONS = {
  EWSPalaran: {
    name: "EWS Kecamatan Palaran",
    telegramBot: "https://t.me/EWSPalaranBot"  // Ganti dengan bot Anda
  },
  EWSSambutan: {
    name: "EWS Kecamatan Sambutan",
    telegramBot: "https://t.me/EWSSambutanBot" // Ganti dengan bot Anda
  }
};
```

### Threshold Sensor

Edit threshold di `script.js` sesuai kebutuhan:

```javascript
// Kelembapan
data.kelembapan <= 50 ? "Kering" : data.kelembapan < 70 ? "Lembap" : "Basah"

// Kemiringan
data.kemiringan <= 4 ? "Landai" : data.kemiringan < 17 ? "Sedang" : "Curam"

// Getaran
data.getaran <= 0.126 ? "Rendah" : data.getaran < 0.501 ? "Sedang" : "Tinggi"
```

## 📡 API Endpoint

### GET /api/antares

**Parameters:**
- `lokasi` (required): `EWSPalaran` atau `EWSSambutan`
- `type` (required): `latest` atau `all`

**Example:**
```
GET /api/antares?lokasi=EWSPalaran&type=latest
GET /api/antares?lokasi=EWSSambutan&type=all
```

**Response (latest):**
```json
{
  "kelembapan": 65,
  "getaran": "0.15",
  "kemiringan": "12.50",
  "potensi": "Sedang",
  "waktu": "20260610T135000"
}
```

**Response (all):**
```json
[
  {
    "kelembapan": 65,
    "getaran": "0.15",
    "kemiringan": "12.50",
    "potensi": "Sedang",
    "waktu": "20260610T135000"
  },
  ...
]
```

## 🧪 Testing Lokal

```bash
# Install Vercel CLI
npm install -g vercel

# Jalankan development server
vercel dev
```

Buka browser dan akses `http://localhost:3000`

## 🔒 Keamanan

- ✅ API key disimpan di environment variables (tidak di code)
- ✅ Whitelist lokasi untuk mencegah injection
- ✅ HTTPS otomatis di Vercel
- ✅ `.env` tidak ter-commit ke repository

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 👥 Author

**BPBD Kota Samarinda**

## 📄 License

MIT License - bebas digunakan untuk kepentingan mitigasi bencana

## 📞 Kontak Darurat

- **Emergency**: 112
- **BPBD Samarinda**: (0541) xxxx

---

**Version**: 1.0.0  
**Last Updated**: 27/01/2026
