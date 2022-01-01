const { io } = require("socket.io-client");
const { getToken } = require("./keycloak");

const HOST_URL = 'ws://localhost:1992'
const DEFAULT_USER = 'sockettest'
const DEFAULT_PASS = 'test'

module.exports.getSocket = (
  user = DEFAULT_USER,
  pass = DEFAULT_PASS
) => new Promise((resolve, reject) => getToken(user, pass)
    .then(token => io(HOST_URL, {
      extraHeaders: {
        Authorization: `Bearer ${token}`
      }
    }))
    .then(resolve)
    .catch(reject)
)
