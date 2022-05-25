const express = require('express')
const connect = require('./schemas')
const app = express()
const port = 3000

connect()

const goodsRouter = require('./routes/goods')

const requestMiddleware = (req, res, next) => {
  console.log(req.originalUrl, new Date())
  next()
}

app.use(express.static('static'))
app.use(express.json())
app.use(express.urlencoded())
app.use(requestMiddleware)

app.use('/api', goodsRouter)

app.get('/',  (req, res) => {
  res.send('Hello world')
})

app.listen(port, () => {
  console.log(port, '포트 실행')
})