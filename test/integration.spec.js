const WebSocket = require('ws');
const debug = require('debug')
const { expect }= require('chai')

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms)) 
const collectEvents = (eventEmmiter, eventName, count=1) => {
  const _debug = debug('app:collectEvents')
  return new Promise((resolve) => {
    const result = []
    const listener = (msg) => {
      _debug(`event: ${eventName}, message: ${msg}`)
      result.push(msg)
      if(result.length === count) {
        resolve(result)
        eventEmmiter.removeListener(eventName, listener)
      }
    }
    eventEmmiter.on(eventName, listener)
  })
}

const createClient = () => {
  const cDebug = debug('app:client')
  const ws = new WebSocket('ws://localhost:8080')
  return collectEvents(ws, 'open').then(() => ws)
}

const createServer = () => {
  const sDebug = debug('app:server')
  const server = new WebSocket.Server({ port: 8080 });

  server.on('connection', function connection(ws) {
    for (let each of server.clients) {
      if (ws !== each) {
        each.send('client is connected')
      }
    }
    sDebug('connection')
  });
  return server
}

let server
before('before', function() {
  server = createServer()
})

it('Client receive message about connected clients', async function() {
  const client1 =  await createClient()
  await delay(100)
  const expectation = collectEvents(client1, 'message')
  const client2 =  await createClient()
  const [msg] = await expectation
  expect(msg).eql('client is connected')
})

after('after', function() {
  server.close()
})
