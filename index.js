const WebSocket = require('ws')
const path = require('path')
const express = require('express')
const debug = require('debug')

const app = express()

const publicDir = path.join(__dirname, 'public')

let clienId = 0
const getId = () => {
  clienId = clienId + 1
  return clienId - 1
}

const createSocketServer = (server) => {
  const sDebug = debug('app:server')
  const wsserver = new WebSocket.Server({ server });

  wsserver.on('connection', function connection(ws) {
    const id = getId()
    for (otherWs of wsserver.clients) {
      if (otherWs === ws) {
        continue
      }
      otherWs.send(`client ${id} is connected`)
    }
    ws.on('message', (message) => {
      for (otherWs of wsserver.clients) {
        if (otherWs === ws) {
          continue
        }
        otherWs.send(`client ${id} said: ${message}`)
      }
    })
    ws.on('close', () => {
      for (otherWs of wsserver.clients) {
        if (otherWs === ws || otherWs.readyState !== 1) {
          continue
        }
        otherWs.send(`client ${id} is closed`)
      }
    })
  });
  return wsserver
}

app.use('/public', express.static(publicDir))
app.get('/', function(req, res) {
      res.sendFile(path.join(publicDir, 'index.html'));
});


const server = app.listen(process.env.PORT, () => console.log('Example app listening on port 3000!'))
createSocketServer(server)

