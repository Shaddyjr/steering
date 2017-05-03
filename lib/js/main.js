var packages = [];
var packAmt = 100;
var allAnimals = [];
var animalNum = 10;

function setup(){
    createCanvas(800,600);
    frameRate(20);
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

    for (var i = 0; i < packages.length; i++){
        packages[i].draw();
    }
    
    // var mouse = createVector(mouseX, mouseY);
    // x.seek(mouse);
    for( var k = 0; k<animalNum; k++){
        allAnimals[k].eat(packages);
        allAnimals[k].draw();
    }

    if(packages.length<packAmt/2){
        addFood(10);
    }
}