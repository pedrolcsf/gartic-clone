const express = require('express');
const socketIo = require('socket.io');

const app = express();

const http = require('http');
const server = http.createServer(app);

const io = socketIo().listen(server)

server.listen(3000, () => {
  console.log('running')
})

app.use(express.static(__dirname + "/public"));

var history = [];

io.on('connection', (socket) => {

  socket.on('deletar', () => {
    history = [];
  });

  history.forEach(line => {
    socket.emit('drawn', line)
  })
  
  socket.on('drawn', (line) => {
    history.push(line);  
    io.emit('drawn', line);
  });


});