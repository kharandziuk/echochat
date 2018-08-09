const WebSocket = require('ws');
const debug = require('debug')

const collectEvents = (eventEmmiter, eventName, count=1) => {
  const _debug = debug('app:colletEvents')
  _debug('set colletEvents', eventName)
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
  const ws = new WebSocket('ws://localhost:8080');
  return new Promise((resolve, reject) => {
    ws.on('open', () => {
      cDebug('open')
      resolve(ws)
    })
  })}



let wss
before('before', function() {
  const sDebug = debug('app:server')
  wss = new WebSocket.Server({ port: 8080 });

  wss.on('connection', function connection(ws) {
    sDebug('connection')
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
      ws.send('something');
    });

    sDebug('server send')
  });
})

it('the test', async function() {
  const client =  await createClient()

  const pr = collectEvents(client, 'message')
  client.on('message', function incoming(message) {
    console.log('client received: %s', message);
  });
  client.send('something')
  const [msg] = await pr
})

after('after', function() {
  wss.close()
})
