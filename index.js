import express from 'express'
import fetch from 'node-fetch'
import cp from 'child_process'
import os from 'os'

const app = express()
const PORT = process.env.PORT || 3000 // Gunakan PORT dari environment atau default 3000

// Fungsi untuk memformat ukuran file/memori
function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B'
    const k = 1024
    const sizes = ['KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i - 1]
}

// Fungsi untuk memformat tanggal
function formatDate(n, locale = 'id') {
    const d = new Date(n)
    return d.toLocaleDateString(locale, { timeZone: 'Asia/Jakarta' })
}

// Endpoint utama
app.get('/', (req, res) => res.send('Hello World!'))

// Endpoint untuk status server
app.get('/status', async (req, res) => {
    const status = {}

    // Penggunaan disk
    try {
        status['diskUsage'] = cp.execSync('du -sh').toString().split('M')[0] + ' MB'
    } catch (error) {
        status['diskUsage'] = 'Tidak tersedia'
    }

    // Penggunaan memori
    const used = process.memoryUsage()
    for (let x in used) {
        status[x] = formatSize(used[x])
    }

    const totalmem = os.totalmem()
    const freemem = os.freemem()
    status['memoryUsage'] = `${formatSize(totalmem - freemem)} / ${formatSize(totalmem)}`

    res.json({
        creator: '@rasssya766',
        message: 'Online!',
        uptime: new Date(process.uptime() * 1000).toUTCString().split(' ')[4],
        status: status
    })
})

// Fungsi untuk menjaga server tetap hidup
function keepAlive() {
    const url = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
    if (/(\/\/|\.)undefined\./.test(url)) return
    setInterval(() => {
        fetch(url).catch(console.log)
    }, 30 * 1000)
}

// Jalankan server
app.listen(PORT, () => {
    keepAlive()
    console.log(`Server berjalan di port ${PORT}`)
})
