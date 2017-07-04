module.exports = (buf) => {
  let u = new Uint8Array(buf.length)
  for (let i = 0; i < buf.length; ++i) {
    u[i] = buf[i]
  }
  return u
}
