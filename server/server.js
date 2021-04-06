import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'
import axios from 'axios'

import cookieParser from 'cookie-parser'
import config from './config'
import Html from '../client/html'
// import { id } from 'postcss-selector-parser'

const { readFile, writeFile, unlink } = require("fs").promises; 
require('colors')

let Root
try {
  // eslint-disable-next-line import/no-unresolved
  Root = require('../dist/assets/js/ssr/root.bundle').default
} catch {
  console.log('SSR not found. Please run "yarn run build:ssr"'.red)
}

let connections = []

const port = process.env.PORT || 8090
const server = express()

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  bodyParser.json({ limit: '50mb', extended: true }),
  cookieParser()
]

middleware.forEach((it) => server.use(it))

server.get('/api/v1/users', async (req, res) => {
 const users = await readFile(`${__dirname}/data/users.json`, { encoding: "utf8" })  
      .then(text => {  
        return JSON.parse(text)  
      })  
      .catch(async () => {  
         const resultErr = await axios('https://jsonplaceholder.typicode.com/users')
         .then(({data}) => {
          writeFile(`${__dirname}/data/users.json`, JSON.stringify(data), { encoding: "utf8" })
          return data
         })
         .catch((err) => err)
         return resultErr
      })
      res.json(users)
})

server.post('/api/v1/users', async (req, res) => {
  const user = req.body
  const result = await readFile(`${__dirname}/data/users.json`, { encoding: "utf8" })  
  .then(text => {  
    const parseText = JSON.parse(text)
    const LastId =  parseText[parseText.length - 1].id + 1
    const newUser = [...parseText, {id: LastId, ...user}]
    writeFile(`${__dirname}/data/users.json`, JSON.stringify(newUser), { encoding: "utf8" })
    return { status: 'success', id: LastId }
  })
  res.json(result)
})

server.patch('/api/v1/users/:userId', async (req, res) => {
  const {userId} = req.params
  const newUser = req.body
  await readFile(`${__dirname}/data/users.json`, { encoding: "utf8" })
  .then(text => {
    const users = JSON.parse(text)
    const updateUser = users.map(user => {
      if (user.id === +userId) {
        return { ...user, ...newUser}
      }
      return user
    })
    writeFile(`${__dirname}/data/users.json`, JSON.stringify(updateUser), { encoding: "utf8" })
  })
  res.json({ status: 'success', id: userId })
})

server.delete('/api/v1/users/:userId', async (req, res) => {
  const {userId} = req.params
  const result = await readFile(`${__dirname}/data/users.json`, { encoding: "utf8" })  
  .then(text => {  
    const users = JSON.parse(text)
    const number = +userId
    users.splice(number - 1, 1)
    writeFile(`${__dirname}/data/users.json`, JSON.stringify(users), { encoding: "utf8" })
    return { status: 'success', id: userId }
  })
  res.json(result)
})

server.delete('/api/v1/users', (req, res) => {
  unlink(`${__dirname}/data/users.json`)
  res.json({ status: 'success' })
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Skillcrucial'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

const app = server.listen(port)

if (config.isSocketsEnabled) {
  const echo = sockjs.createServer()
  echo.on('connection', (conn) => {
    connections.push(conn)
    conn.on('data', async () => {})

    conn.on('close', () => {
      connections = connections.filter((c) => c.readyState !== 3)
    })
  })
  echo.installHandlers(app, { prefix: '/ws' })
}
console.log(`Serving at http://localhost:${port}`)
