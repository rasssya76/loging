import express from 'express'
import fetch from 'node-fetch'
import cp from 'child_process'
import os from 'os'

const app = express()

function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B'
    const k = 1024
    const sizes = ['KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i - 1]
}

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/status', (req, res) => {
    const status = {}

    try {
        status['diskUsage'] = cp.execSync('du -sh').toString().split('M')[0] + ' MB'
    } catch (error) {
        status['diskUsage'] = 'Tidak tersedia'
    }

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

// Ekspor sebagai handler untuk Vercel
export default (req, res) => app(req, res)
