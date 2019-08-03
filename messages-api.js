const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

const parserMiddleware = bodyParser.json()
app.use(parserMiddleware)

let count = 0;
const maxRequests = 5

const requestsLimit = (request, response, next) => {
  if (count >= maxRequests) {
    response.status(429).send({ 'error': 'Too Many Requests' })
  } else {
    console.log(`Request number ${count + 1}`)
    next()
  }
  count++
}

app.post('/messages', requestsLimit, (request, response, next) => {
  if (!request.body.hasOwnProperty('text') || !request.body.text) {
    response.status(400).send({ 'error': 'Bad Request' })
  } else {
    console.log(request.body.text)
    response.send({ "message": "Message received loud and clear" })
  }
})

app.listen(port, () => console.log(`Listening on :${port}`))