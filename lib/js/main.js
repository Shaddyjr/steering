var packages = [];
var allAnimals = [];
var animalNum = 50;
var packAmt = animalNum;
var canvas;
var speed = 20;

window.onresize = function() {
  var w = window.innerWidth;
  var h = window.innerHeight;  
  canvas.size(w,h);
  width = w;
  height = h;
};

function setup(){
    canvas = createCanvas(window.innerWidth, window.innerHeight);
    addFood();
    for( var k = 0; k<animalNum; k++){
        allAnimals.push(new Animal(myRandom(width), myRandom(height)));
    }
}

function addFood(num){
    if(!num){
        num = packAmt;
    }

    for ( var i =0; i<num; i++ ){
        packages.push(new Food(myRandom(width), myRandom(height)));
    }
}

function draw(){
    background(40);
    //packAmt = allAnimals.length/2;

    //changing speed
    fill(225);
    textSize(25);
    textAlign(CENTER);
    if(keyIsDown(RIGHT_ARROW)){
        if(speed<60){
            speed++;
        }
        text("Speed: " + speed, width/2, 50)
    }else if(keyIsDown(LEFT_ARROW)){
        if(speed>20){
            speed--;
        }
        text("Speed: " + speed, width/2, 50)
    }
    frameRate(speed);

    for (var i = 0; i < packages.length; i++){
        packages[i].draw();
    }
    
    // var mouse = createVector(mouseX, mouseY);
    // x.seek(mouse);
    for( var k = 0; k<allAnimals.length; k++){
        allAnimals[k].eat(packages);
        allAnimals[k].draw();
    }

    //removing dead
    allAnimals=allAnimals.filter((x)=>!x.dead());

    if(packages.length<packAmt/2){
        addFood();
    }

    addFittest();

    //text
    fill(225);
    textSize(25);
    textAlign(CENTER);
    text("Generation: " + findGen(), width/2, 25);
}

function addFittest(){
    var fittest = findFittest();
    if(Math.random()<.01){
        if(fittest){
            allAnimals.push(findFittest().replicate());
        }else{
            allAnimals.push(new Animal(myRandom(width), myRandom(height)));
        }
    }else if(allAnimals.length<1){
        allAnimals.push(new Animal(myRandom(width), myRandom(height)));
        fittest = allAnimals[0];
    }
    fittest.draw(true);
}

function findFittest(){
    return allAnimals.sort((a,b)=>b.HP-a.HP)[0];
}

function findGen(){
    return allAnimals.sort((a,b)=>b.dna.gen-a.dna.gen)[0].dna.gen;
}

function mouseDragged(){
    allAnimals.push(new Animal(mouseX, mouseY));
}

