import { Application, Router } from "https://deno.land/x/oak/mod.ts"
import { format } from "https://deno.land/std/datetime/mod.ts"

const app = new Application()
const router = new Router()

function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    const k = 1024
    const sizes = ['KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i - 1]}`
}

router.get("/", (ctx) => {
    ctx.response.body = "Hello World!"
})

router.get("/status", (ctx) => {
    const used = performance.memory
    const status: Record<string, string> = {
        totalJSHeapSize: formatSize(used.totalJSHeapSize),
        usedJSHeapSize: formatSize(used.usedJSHeapSize),
        jsHeapSizeLimit: formatSize(used.jsHeapSizeLimit),
    }

    ctx.response.body = {
        creator: "@rasssya766",
        message: "Online!",
        uptime: format(new Date(), "HH:mm:ss"),
        status,
    }
})

app.use(router.routes())
app.use(router.allowedMethods())

console.log("Server running on http://localhost:8000")
await app.listen({ port: 8000 })
