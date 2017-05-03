var packages = [];
var packAmt = 200;
var allAnimals = [];
var animalNum = 3;

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
    for( var k = 0; k<allAnimals.length; k++){
        allAnimals[k].eat(packages);
        allAnimals[k].draw();
    }

    //removing dead
    allAnimals=allAnimals.filter((x)=>!x.dead());

    if(packages.length<packAmt/2){
        addFood(10);
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
    }
}

function findFittest(){
    return allAnimals.sort((a,b)=>b.HP-a.HP)[0];
}

function findGen(){
    return allAnimals.sort((a,b)=>b.dna.gen-a.dna.gen)[0].dna.gen;
}