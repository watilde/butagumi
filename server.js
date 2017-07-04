const { readFileSync } = require('fs')
const { createServer } = require('http')
const toUint8Array = require('./lib/toUint8Array')
const compileWebAssembly = (data, cb) => {
  const buffer = toUint8Array(data)
  return WebAssembly.compile(buffer)
}

const server = createServer((req, res) => {
  const { url, body } = req
  if (url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.write(readFileSync('./index.html'))
    res.end()
  } else if (url === '/simple.wasm') {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.write(readFileSync('./addTwo.wast'))
    res.end()
  } else if (url === '/api/compile') {
    const chunks = [];
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    req.on('data', chunk => chunks.push(chunk))
    req.on('end', () => {
      compileWebAssembly(Buffer.concat(chunks)).then((mod) => {
        res.write(mod)
        res.end()
      }).catch((e) => {
        res.end('compile error')
      })
    })
  }
});

server.listen(1337);
