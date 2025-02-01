import { Application, Router } from "oak/mod.ts"

// Format ukuran data
function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    const k = 1024
    const sizes = ['KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i - 1]}`
}

const app = new Application()
const router = new Router()

// Route: Home
router.get("/", (ctx) => {
    ctx.response.body = "Hello World!"
})

// Route: Status
router.get("/status", (ctx) => {
    const memoryUsage = performance.memory
    const status = {
        totalJSHeapSize: formatSize(memoryUsage.totalJSHeapSize),
        usedJSHeapSize: formatSize(memoryUsage.usedJSHeapSize),
        jsHeapSizeLimit: formatSize(memoryUsage.jsHeapSizeLimit),
        uptime: `${(Deno.uptime() / 60).toFixed(2)} minutes`
    }

    ctx.response.body = {
        creator: "@rasssya766",
        message: "Online!",
        status
    }
})

app.use(router.routes())
app.use(router.allowedMethods())

// Hanya jalankan server saat dibutuhkan (untuk GitHub Actions atau Deno.dev)
if (import.meta.main) {
    console.log("Server running on http://localhost:8000")
    await app.listen({ port: 8000 })
}

export default app.handle
