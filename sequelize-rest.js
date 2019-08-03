const Sequelize = require('sequelize');
const express = require('express')
const bodyParser = require('body-parser')

databaseUrl = 'postgres://postgres:secret@localhost:5432/postgres'
const db = new Sequelize(databaseUrl);

const Movie = db.define('movie', {
  title: Sequelize.STRING,
  yearOfRelease: Sequelize.INTEGER,
  synopsis: Sequelize.STRING
})

db.sync()
  .then(() => Movie.create({
      title: 'Inception',
      yearOfRelease: 2010,
      synopsis: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.'}))
  .then(() => console.log('DataBase was updated'))
  .catch(console.error)

const app = express()
const port = 4000

const parserMiddleware = bodyParser.json()
app.use(parserMiddleware)

app.listen(port, () => console.log(`Listening on :${port}`))

app.post('/movie', (request, response, next) => {
  Movie.create(request.body)
    .then(movie => response.send(movie))
    .catch(err => next(err))
})

app.get('/movie', (request, response, next) => {
  Movie.findAll()
    .then(movies => response.send(movies))
    .catch(err => next(err))
  }
)

app.get('/movie/:id', (request, response, next) => {
  Movie.findByPk(request.params.id)
    .then(movie => response.send(movie))
    .catch(err => next(err))
})

app.put('/movie/:id', (request, response, next) => {
  Movie.findByPk(request.params.id)
    .then(movie => movie.update(request.body))
    .then(movie => response.send(movie))
    .catch(err => next(err))
})

app.delete('/movie/:id', (request, response, next) => {
  Movie.destroy({
    where : { id : request.params.id}
  })
    .then(number => response.send({ number }))
    .catch(err => next(err))
})