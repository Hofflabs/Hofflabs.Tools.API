import { promises as fs } from 'fs'
import { join } from 'path'

const logDir = join(process.cwd(), 'logs')

// Ensure the logs directory exists once
async function ensureLogDirExists() {
  try {
    await fs.mkdir(logDir, { recursive: true })
  } catch {}
}

await ensureLogDirExists()

// Async queue buffer
const queue: string[] = []
let isFlushing = false

function flushQueue() {
  if (isFlushing || queue.length === 0) return

  isFlushing = true

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-GB').replace(/\//g, '::') // dd::mm::yy
  const filePath = join(logDir, `${dateStr}.log`)

  const logsToWrite = queue.splice(0, queue.length).join('\n') + '\n'

  fs.appendFile(filePath, logsToWrite)
    .catch(console.error)
    .finally(() => {
      isFlushing = false
      if (queue.length) flushQueue()
    })
}

function formatLog(header: string, contents?: any): string {
  const now = new Date()
  const time = now.toTimeString().slice(0, 5)
  const formattedHeader = `[${time}] ${header}`
  const formattedContents =
    contents !== undefined
      ? `${typeof contents === 'string' ? contents : JSON.stringify(contents, null, 2)}`
      : ''
  return `${formattedHeader}\n${formattedContents}`
}

export const logger = {
  log(header: string, contents?: any) {
    if (process.client) return
    queue.push(formatLog(header, contents))
    flushQueue()
  },
  info(header: string, contents?: any) {
    this.log(`INFO - ${header}`, contents)
  },
  warn(header: string, contents?: any) {
    this.log(`WARN - ${header}`, contents)
  },
  error(header: string, contents?: any) {
    this.log(`ERROR - ${header}`, contents)
  }
}
