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

let clienId = 0
const getId = () => {
  clienId = clienId + 1
  return clienId - 1
}




let server
beforeEach('before', function() {
  server = createServer()
})

it('Client receive message about connected clients', async function() {
  const client1 =  await createClient()
  const expectation = collectEvents(client1, 'message')
  const client2 =  await createClient()

  const [msg] = await expectation
  expect(msg).eql('client 1 is connected')
})

it('Client receive message about connected clients', async function() {
  const client1 =  await createClient()
  const client2 =  await createClient()
  client1.send('something important')
  const expectedMessages1 = collectEvents(client1, 'message')
  const expectedMessages2 = collectEvents(client2, 'message')
  expect(await expectedMessages1).eql(['client 3 is connected'])
  expect(await expectedMessages2).eql(['client 2 said: something important'])
})

it('Client receive message about closed client', async function() {
  const client1 =  await createClient()
  const client2 =  await createClient()
  const expectedMessages1 = collectEvents(client1, 'message', 2)
  client2.close()
  expect(await expectedMessages1).eql([
    'client 5 is connected',
    'client 5 is closed'
  ])
})

afterEach('after', function() {
  server.close()
})
