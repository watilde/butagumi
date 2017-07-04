const readFileSync = require('fs').readFileSync
const createServer = require('http').createServer
const toUint8Array = require('./lib/toUint8Array')
const compileWebAssembly = (data) => {
  const buffer = toUint8Array(data)
  return WebAssembly.compile(buffer)
}

const server = createServer((req, res) => {
  const url = req.url
  if (url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.write(readFileSync('./index.html'))
    res.end()
  } else if (url === '/hello_world.wasm') {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.write(readFileSync('./hello_world.wasm'))
    res.end()
  } else if (url === '/api/compile') {
    const chunks = []
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    req.on('data', chunk => chunks.push(chunk))
    req.on('end', () => {
      compileWebAssembly(Buffer.concat(chunks)).then((mod) => {
        res.write(mod)
        res.end()
      }).catch((e) => {
        console.error(e)
        res.end()
      })
    })
  }
})

server.listen(1337)
