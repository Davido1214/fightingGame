const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const gravity = 3;

canvas.width = 1920;
canvas.height = 1080;

c.fillRect(0, 0, canvas.width, canvas.height);

const background = new Sprite({
  position:{
    x: 0,
    y: 0 
  },
  imageSrc: './images/background.png'
})

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x:0,
    y:0
  },
  imageSrc: './images/freeKnight/_Idle.png',
  scale:5,
  framesMax: 10,
  offset: {
    x:215, 
    y:180
  },
  sprites: {
    idle: {
      imageSrc: './images/freeKnight/_Idle.png',
      framesMax: 10,
    },
    run: {
      imageSrc: './images/freeKnight/_Run.png',
      framesMax: 10
    },
    jump: {
      imageSrc: './images/freeKnight/_Jump.png',
      framesMax: 3,
    },
    fall: {
      imageSrc: './images/freeKnight/_Fall.png',
      framesMax: 3
    },
    attack1: {
      imageSrc: './images/freeKnight/_Attack.png',
      framesMax: 4,
    },
    takeHit: {
      imageSrc: './images/freeKnight/_Hit.png',
      framesMax: 1
    },
    death: {
      imageSrc: './images/freeKnight/_Death.png',
      framesMax: 10
    }
  },
  attackBox: {
    offset: {
      x: 170,
      y: 100
    },
    width: 200,
    height: 80
  }
});

const enemy = new Fighter({
  position: {
    x: 1720,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: './images/kenji/Idle.png',
  framesMax: 4,
  scale: 5,
  offset: {
    x: 400,
    y: 420
  },
  sprites: {
    idle: {
      imageSrc: './images/kenji/Idle.png',
      framesMax: 4
    },
    run: {
      imageSrc: './images/kenji/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './images/kenji/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './images/kenji/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './images/kenji/Attack1.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: './images/kenji/Take hit.png',
      framesMax: 3
    },
    death: {
      imageSrc: './images/kenji/Death.png',
      framesMax: 7
    },
    
  },
  attackBox: {
    offset: {
      x: -320,
      y: 100
    },
    width: 320,
    height: 80
  }
})

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};



decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update()
  c.fillStyle = 'rgba(255,255,255,0.1)'
  c.fillRect(0,0,canvas.width,canvas.height)
  player.update();
  enemy.update();
 

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //player movement
  
  if (keys.a.pressed && player.lastKey === "a") {
    player.switchSprite('run')
    player.velocity.x = -22;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 22;
    player.switchSprite('run')
  }else{player.switchSprite('idle')}

  //jumping
  if(player.velocity.y < 0) {
    player.switchSprite('jump')
  }else if (player.velocity.y > -0){
    player.switchSprite('fall')
  }

  //enemy movement
  
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.switchSprite('run')
    enemy.velocity.x = -22;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.switchSprite('run')
    enemy.velocity.x = 22;
  } else {enemy.switchSprite('idle')}

  if(enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  }

  if(enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  }else if (enemy.velocity.y > -0){
    enemy.switchSprite('fall')
  }

  //detect for collision & enemy gets hit
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking && player.frameCurrent == 2
  ) {
    enemy.takeHit()
    player.isAttacking = false;
    gsap.to('#enemyHealth', {
      width: enemy.health + "%"
    });
  }

  // if player misses
  if(player.isAttacking && player.frameCurrent === 2){
    player.isAttacking = false
  }


  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking && enemy.frameCurrent === 2
  ) {
    player.takeHit()
    enemy.isAttacking = false;
    gsap.to('#playerHealth', {
      width: player.health + "%"
    });
  }

  if(enemy.isAttacking && enemy.frameCurrent === 2){
    enemy.isAttacking = false
  }

  //end game based on health
  if(enemy.health <=0 || player.health <= 0){
    determineWinner({player,enemy,timerId})
  }

}

animate();

window.addEventListener("keydown", (event) => {
  if (!player.dead){
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      player.velocity.y = -55;
      break;
    case " ":
      player.attack();
      break;

  }
}
  
  if(!enemy.dead){
  switch(event.key){
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      enemy.velocity.y = -55;
      break;
    case "ArrowDown":
      enemy.attack();
      break;
  }
}
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }

  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
