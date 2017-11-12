const deepstream = require('deepstream.io-client-js')
const needle = require('needle')


class HTTPClient {

  constructor (options) {
    this._authUrl = options.authUrl
    this._url = options.url
  }

  init (credentials) {
    return new Promise((resolve, reject) => {
      needle.post(this._authUrl , credentials, { json: true }, (err, response) => {
        if (err || response.statusCode > 299 || response.statusCode < 200) {
          reject(err || response.body || response.statusCode)
        } else {
          this._token = response.body.token
          resolve()
        }
      })
    })
  }

  emit (topic, data) {
    return new Promise((resolve, reject) => {
      const postData = Object.assign(
        {},
        { token: this._token, },
        { body: [ { topic: 'event', action: 'emit', eventName: topic, data } ] }
      )
      needle.post(this._url , postData, { json: true }, (err, response) => {
        if (err || response.body.result !== 'SUCCESS') {
          reject(err)
          return
        }
        resolve()
      })
    })
  }

  make (rpcName, data) {
    return new Promise((resolve, reject) => {
      const postData = Object.assign(
        {},
        { token: this._token, },
        { body: [ { topic: 'rpc', action: 'make',  rpcName, data } ] }
      )
      needle.post(this._url , postData, { json: true }, (err, response) => {
        if (err || response.body.result !== 'SUCCESS') {
          reject(err || response && response.body)
          return
        }
        resolve()
      })
    })
  }

  set ({ recordName, path, data, version }) {
    if (!version) version = -1
    return new Promise((resolve, reject) => {
      const postData = Object.assign(
        {},
        { token: this._token, },
        { body: [ { topic: 'record', action: 'write', recordName, path, data, version } ] }
      )
      needle.post(this._url , postData, { json: true }, (err, response) => {
        console.log(response.body)
        if (err || response.body.result !== 'SUCCESS') {
          reject(err || response && response.body)
          return
        }
        resolve()
      })
    })
  }

  read (recordName) {
    return new Promise((resolve, reject) => {
      const postData = Object.assign(
        {},
        { token: this._token, },
        { body: [ { topic: 'record', action: 'read', recordName } ] }
      )
      needle.post(this._url , postData, { json: true }, (err, response) => {
        if (err || response.body.result !== 'SUCCESS') {
          reject(err || response && response.body)
          return
        }
        resolve(response.body)
      })
    })
  }

  send (data) {
    return new Promise((resolve, reject) => {
      const postData = Object.assign(
        {},
        { token: this._token, },
        { body: data }
      )
      needle.post(this._url , postData, { json: true }, (err, response) => {
        if (err || response.body.result !== 'SUCCESS') {
          reject(err || response.body)
          return
        }
        resolve()
      })
    })
  }
}

async function run () {
  const credentials = {
    authUrl: 'https://154.deepstreamhub.com/http/v1/auth/827ac0b0-daa7-4389-9f64-d2b83c1d6e37',
    url: 'https://154.deepstreamhub.com/http/v1/827ac0b0-daa7-4389-9f64-d2b83c1d6e37',
  }
  const client = new HTTPClient(credentials)
  await client.init({ type: 'email', email: 'alex@test.com', password: 'password' })
    .catch(console.log)

  const recordName = 'test'
  await client.set({
    recordName,
    data: { hello: Date.now() }
  })

  const result = await client.read(recordName)
  console.log(result)


}
run()