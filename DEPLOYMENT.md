# Panduan Deployment ke Vercel

Panduan lengkap untuk deploy aplikasi IoT Mobile ke Vercel.

## Prasyarat

- Akun Vercel (gratis di [vercel.com](https://vercel.com))
- Node.js terinstall di komputer Anda
- Git terinstall (untuk deployment via GitHub)

## Metode 1: Deploy via Vercel CLI (Tercepat)

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Login ke Vercel

```bash
vercel login
```

Ikuti instruksi untuk login menggunakan email atau GitHub.

### 3. Deploy Project

**Untuk Preview Deployment:**

```bash
vercel
```

**Untuk Production Deployment:**

```bash
vercel --prod
```

Vercel CLI akan:

- Mendeteksi framework (Vite)
- Menggunakan konfigurasi dari `vercel.json`
- Build project Anda
- Deploy ke Vercel

### 4. Akses Aplikasi

Setelah deployment selesai, Vercel akan memberikan URL untuk mengakses aplikasi Anda:

- Preview: `https://iot-mobile-xxx.vercel.app`
- Production: `https://iot-mobile.vercel.app` (atau custom domain)

## Metode 2: Deploy via GitHub (Recommended untuk Production)

### 1. Push ke GitHub

Pastikan project Anda sudah di-push ke GitHub repository.

```bash
git add .
git commit -m "Setup Vercel deployment"
git push origin main
```

### 2. Import di Vercel Dashboard

1. Buka [vercel.com/new](https://vercel.com/new)
2. Pilih "Import Git Repository"
3. Pilih repository `iot-mobile`
4. Vercel akan otomatis mendeteksi konfigurasi
5. Klik "Deploy"

### 3. Auto-Deploy

Setiap kali Anda push ke branch `main`, Vercel akan otomatis:

- Build ulang aplikasi
- Deploy versi terbaru
- Memberikan preview URL untuk setiap commit

## Konfigurasi

File `vercel.json` sudah dikonfigurasi dengan:

- **SPA Routing**: Semua route akan diarahkan ke `index.html` untuk React Router
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Framework**: Vite

## Environment Variables (Opsional)

Jika aplikasi Anda memerlukan environment variables:

### Via CLI:

```bash
vercel env add VITE_API_URL
```

### Via Dashboard:

1. Buka project di Vercel Dashboard
2. Pilih "Settings" > "Environment Variables"
3. Tambahkan variable yang diperlukan
4. Redeploy aplikasi

> **Note**: Environment variables untuk Vite harus diawali dengan `VITE_`

## Custom Domain (Opsional)

1. Buka project di Vercel Dashboard
2. Pilih "Settings" > "Domains"
3. Tambahkan domain custom Anda
4. Ikuti instruksi untuk konfigurasi DNS

## Troubleshooting

### Build Gagal

**Error: "Command failed"**

- Pastikan `npm run build` berhasil di local
- Cek log error di Vercel Dashboard
- Pastikan semua dependencies ada di `package.json`

**Error: "Module not found"**

- Jalankan `npm install` di local
- Commit `package-lock.json`
- Redeploy

### Routing Tidak Bekerja

**404 pada refresh halaman**

- Pastikan `vercel.json` ada dan terkonfigurasi dengan benar
- File `vercel.json` harus ada di root project

### Performance Issues

**Aplikasi lambat loading**

- Vercel otomatis mengoptimasi assets
- Pertimbangkan code splitting
- Gunakan lazy loading untuk komponen besar

## Perintah Berguna

```bash
# Lihat deployment list
vercel ls

# Lihat logs
vercel logs [deployment-url]

# Hapus deployment
vercel rm [deployment-name]

# Lihat project info
vercel inspect [deployment-url]

# Promote deployment ke production
vercel promote [deployment-url]
```

## Tips

1. **Preview Deployments**: Setiap branch akan mendapat preview URL sendiri
2. **Rollback**: Anda bisa rollback ke deployment sebelumnya via Dashboard
3. **Analytics**: Aktifkan Vercel Analytics untuk monitoring performa
4. **Edge Network**: Aplikasi Anda akan di-deploy ke CDN global Vercel

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel CLI Reference](https://vercel.com/docs/cli)

---

**Selamat! Aplikasi IoT Mobile Anda siap di-deploy ke Vercel! 🚀**
