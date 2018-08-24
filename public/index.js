const HOST = location.origin.replace(/^http/, 'ws')
const ws = new WebSocket(HOST);

const $newMessage = $('#new-message')
const $btnSend = $('#btn-send')
const $messages = $('#messages')

$btnSend.on('click', () => {
  const message = $newMessage.val()
  if (!message) {
    return
  }
  ws.send(message)
  showMessage(`you said: ${message}`)
})

const showMessage = (msg) => {
  $messages.append(
    `<span>${msg}<br></span>`
  )
}

ws.onmessage = function (event) {
 showMessage(event.data)
};
