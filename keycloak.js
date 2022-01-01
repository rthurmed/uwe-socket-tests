const { default: axios } = require("axios");
const { toFormData } = require("./util");

const KEYCLOAK_HOST = 'http://localhost:28080'
const KEYCLOAK_REALM = 'uwe'
const KEYCLOAK_LOGIN = `${KEYCLOAK_HOST}/auth/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`
const DEFAULT_CLIENT = 'web' 

module.exports.getToken = (
  user,
  pass
) => new Promise((resolve, reject) => {
  axios
    .post(KEYCLOAK_LOGIN, toFormData({
      username: user,
      password: pass,
      client_id: DEFAULT_CLIENT,
      grant_type: 'password'
    }))
    .then((response) => {
      resolve(response.data.access_token)
    })
    .catch(reject)
})
