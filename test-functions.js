triggerHello = (response) => {
  if (response === 'Hello') {
    module.exports.writeHello('Hello')
  } 
}

writeHello = (hello) => {
  return hello
}

module.exports = {
  triggerHello,
  writeHello
}