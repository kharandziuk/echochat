var HOST = location.origin.replace(/^http/, 'ws')
console.log(HOST)
var ws = new WebSocket(HOST);
var el = document.getElementById('server-time');

ws.onmessage = function (event) {
  el.innerHTML = 'Server time: ' + event.data;
};var HOST = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(HOST);
var el = document.getElementById('server-time');

ws.onmessage = function (event) {
  el.innerHTML = 'Server time: ' + event.data;
};
