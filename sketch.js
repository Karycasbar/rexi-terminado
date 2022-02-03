var trex ,trex_running, trex_collided;
var edges;
var ground, groundImage;
var invisibleGround;
var cloud,cloudImage;
var obstacle, obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6;
var score;
var obstaclesGroup, cloudsGroup;
var gameOverImg, restartImg, gameOver,restart;

var PLAY = 1;
var END = 0;
var gameState = PLAY;
var jumpSound , checkPointSound, dieSound;

//función cargar archivos
function preload(){  
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  trex_collided = loadAnimation("trex_collided.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup(){
  createCanvas(windowWidth,windowHeight);

  //Trex
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running",trex_running);
  trex.addAnimation("trex_collided",trex_collided);
  trex.scale = 0.5;

  //Suelo
  ground =  createSprite(width/2,height-80,width,2);
  ground.addImage("ground",groundImage);

  //mostramos la imagan del GameOver
  gameOver = createSprite(width/2,height/2 -50);
  gameOver.addImage(gameOverImg);

  //mostramos la imagan del restart
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);

  //escala a las imagenes de gameOver y restart
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  edges = createEdgeSprites();

  //crear un suelo invisible
  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.visible = false;

  score = 0;  

  obstaclesGroup =  new Group();
  cloudsGroup  = new Group();

  trex.setCollider("circle",0,0,40);
  //trex.setCollider("rectangle",0,0,400,trex.height);
  trex.debug = false;  
 
}

function draw(){ 
  background(255);

  //fill("white");
  text("Puntuación: "+ score,width/2,50);  

  if(gameState == PLAY){
    gameOver.visible = false;
    restart.visible = false;

    //mueve el suelo
    ground.velocityX = -(4+ 2*score/100);

    if(score>0 && score % 100 == 0){
      checkPointSound.play();
    }

    //genera la puntuacion
    score = score + Math.round(getFrameRate()/60);

    //Se repite el suelo con la imagen
    if(ground.x < 0){
      ground.x = ground.width/2;
    }

    //salto del dino
    if((touches.length>0 || keyDown("space")) && trex.y >=height-180){
      trex.velocityY = -10;
      jumpSound.play();
      touches = [];
    }
  //gravedad
  trex.velocityY = trex.velocityY + 0.5;

  //aparece las nubes
  spawnClouds();
  //aparece los obstaculos
  spawnObstacles();

  if(obstaclesGroup.isTouching(trex)){
    gameState = END;
    dieSound.play();
    //trex.velocityY = -12;
    //jumpSound.play();
  }


  }
  else if(gameState == END){
    gameOver.visible = true;
    restart.visible = true;

    //detiene el suelo
    ground.velocityX = 0;
    
    trex.velocityY = 0;


    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    //cambio de la animación
    trex.changeAnimation("trex_collided",trex_collided);

    //establece un ciclo de vida a los objetos del juego para 
    //que nunca sean destruidos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    /*if(mousePressedOver(restart)){
      reset();
    }*/
    if (touches.length > 0 || keyDown("space")){
      reset();
      touches=[];
    }
  }    

  //choca el dino con el suelo
  trex.collide(invisibleGround);

    
  drawSprites();
  

}
function spawnClouds(){
  //escribir el codigo para aparecer las nubes
  if(frameCount % 60 ==0){ 
  cloud = createSprite(width+20,height,40,10);
  cloud.addImage(cloudImage);
  cloud.y = Math.round(random(10,60));
  cloud.scale = 0.4;
  cloud.velocityX = -3;

  
  //asigna el ciclo de vida a la nube
  cloud.lifetime = 220;

  

  //ajusta la profundidad
  cloud.depth = trex.depth;
  trex.depth = trex.depth +1;  

  //añade cada nube al grupo 
  cloudsGroup.add(cloud);
  }
}

function spawnObstacles(){
  if(frameCount % 60 == 0){
    obstacle = createSprite(width+20,height-95,20,30);
    obstacle.velocityX = -(6 + score/100);

    //generar los obstaculos aleatorios
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstacle.addImage(obstacle1);
      break;
      case 2: obstacle.addImage(obstacle2);
      break;
      case 3: obstacle.addImage(obstacle3);
      break;
      case 4: obstacle.addImage(obstacle4);
      break;
      case 5: obstacle.addImage(obstacle5);
      break;
      case 6: obstacle.addImage(obstacle6);
      break;
      default: break;
    }
    //asignar escala del obstaculo
    obstacle.scale = 0.6;

    //ciclo de vida del obstaculo
    obstacle.lifetime = 220;

    //añade cada obstaculo al grupo
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.changeAnimation("running",trex_running);
  score=0;
}