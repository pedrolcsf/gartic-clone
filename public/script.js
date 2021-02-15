document.addEventListener('DOMContentLoaded', () => {
  const socket = io.connect();

  const paint = {
    active: false,
    moving: false,
    position: {
      x: 0,
      y: 0
    },
    previousPosition: null
  }

  const screen = document.querySelector("#tela");
  const context = screen.getContext('2d');

  screen.width = 700;
  screen.height = 500;

  context.lineWidth = 3;
  
  const drawnLine = (line) => {
    context.beginPath();
    context.moveTo(line.previousPosition.x, line.previousPosition.y);
    context.lineTo(line.position.x, line.position.y);
    context.stroke();
  }

  screen.onmousedown = (e) => {
    paint.active = true
  };

  screen.onmouseup = (e) => {
    paint.active = false
  };

  screen.onmousemove = (e) => {
    paint.position.x = e.clientX;
    paint.position.y = e.clientY;
    paint.moving = true;
  };

  socket.on('drawn', (line) => {
    drawnLine(line);
  });





  const cycle = () => {
    if(paint.active && paint.moving && paint.previousPosition) {
      socket.emit('drawn', {
        position: paint.position,
        previousPosition: paint.previousPosition
      });
      paint.moving = false;
    }
    paint.previousPosition = {
      x: paint.position.x,
      y: paint.position.y
    }

    setTimeout(cycle, 10);
  };



  cycle();
})