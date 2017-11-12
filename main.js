const deepstream = require('deepstream.io-client-js')
const needle = require('needle')
const request = require('request')
const token


const credentials = {
    authUrl: 'https://154.deepstreamhub.com/http/v1/auth/a70e0e84-aca5-437c-bb8e-dd7a570a6dec',
    url: 'https://154.deepstreamhub.com/http/v1/a70e0e84-aca5-437c-bb8e-dd7a570a6dec',
  }

authenticate(credentials)

/////AUTHENTICATION

function authenticate(credentials){
    const authBody = {
      "type": "email",
      "email": "test@gmail.com",
      "password": "1234"
    }
    //console.log(credentials.authUrl)
   /* needle.post(credentials.authUrl , authBody, { json: true }, (err, response) => {
        if (err || response.body.success !== true) {
          console.log('AUTHENTICATION UNSUCCESSFUL')
          //console.log(response)
        }
        else{
          console.log(response)
        }
    })*/

  request({
    url: credentials.authUrl,
    method: "POST",
    json: true,
    body: authBody
  }, (error, response, body) => {
      if(response.body.token){
        init(response.body.token)
      }
  })
}


/////BATCHED-REQUESTS

function init(token){
  const requestBody = {
    "token": token,
    "body": [
      {
        "topic": "event",
        "action": "emit",
        "eventName": "myEvent",
        "data": {
          "apples": 40,
          "bananas": 100,
          "pears": 60
        }
      },
      {
        "topic": "record",
        "action": "write",
        "recordName": "users/123",
        "path": "firstname",
        "version": 1,
        "data": "Srushtika"
      },
      {
        "topic": "presence",
        "action": "query"
      }
    ]
  }


  request({
    url: credentials.url,
    method: "POST",
    json: true,
    body: requestBody
  }, (error, response, body) => {
      console.log(response.body)
      console.log(response.body[2])
  })
}
