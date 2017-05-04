var Animal = function(x,y, HP, dna, name){
    this.pos = createVector(x,y);
    this.vel = createVector(random(-5,5),random(-5,5));
    this.acc = createVector(0,0);
    this.r = 6; //size of animal
    this.maxSpeed = 5;
    this.maxForce = 0.5;
    this.HP = HP || 50;
    this.name = name? name+"-"+randName(): randName();

    this.dna = dna || {
        "attrFood":random(-5,5),
        "attrPoison":random(-5,5),
        "fRadius":random(10,100),
        "pRadius":random(10,100),
        "gen":0
    }

    this.detriment;

    if(Math.random()>.35){
        //normal food eater
        this.foodGain = 20;
        this.poisonGain = -50;
    }else{
        //poison eater
        this.foodGain = -50;
        this.poisonGain = 20;
    }

    // A method that calculates a steering force towards a target vector
    this.seek = function(target){
        //target is a p5.vector
        var desired = p5.Vector.sub(target.pos, this.pos);

        //scale to maximum speed
        desired.setMag(this.maxSpeed);

        //steering = desired minus velocity
        var steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxForce); //limits turning force

        return steer; //returns acceleration in direction of target with limitation of maxForce
    }

    this.eat = function(allFood){
        //always loosing HP
        this.HP -= 0.1;

        var shortest = Infinity;
        var closest = null; 
        var perception = null;
        for (var i = allFood.length-1; i>=0;i--){ //going through array backwards b/c of splice
            var d = this.pos.dist(allFood[i].pos);
            
            if(d < shortest){
                perception = allFood[i].type=="food"? this.dna.fRadius : this.dna.pRadius;
                shortest = d;
                closest = allFood[i];
                if(shortest < 5){ //eating occurs
                    if(closest.type == "food"){
                        this.HP += this.foodGain;
                    }else{
                        this.HP += this.poisonGain;
                    }
                    allFood.splice(i,1);
                }
            }
        }

        if(shortest<=perception){
            this.steering(closest);
        }
    }

    this.steering = function(package){
        //appropriately deals with different weights of food/poison
        var packageSteer;
        if(package.type=="food"){
            packageSteer = this.dna.attrFood;
        }else{
            packageSteer = this.dna.attrPoison;
        }
        //animal's individual assumption weighs against actual benefit of package
        this.acc.add(this.seek(package).mult(packageSteer));
    }

}

Animal.prototype.draw = function(ring){
    //updates position before drawing
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed); //limiting speed of movement
    this.pos.add(this.vel);//actually using internal info to make the change to the x and y-coordinates
    this.acc.mult(0);//resets acceleration to 0, so that it doesn't keep adding each seek() call

    //Forcing it on otherside of map if off map
    if(this.pos.x>width){
        this.pos.x = 0;
    } else if( this.pos.x <0 ){
        this.pos.x = width;
    }else if(this.pos.y>height){
        this.pos.y=0;
    }else if(this.pos.y<0){
        this.pos.y=height;
    }

    // if(this.poisonGain>0){
    //     fill(225,0,0);
    // }else{
    //     fill(0,225,0);
    // }

    //fills depending on what it wants to eat
    fill(map(this.dna.attrPoison, -5,5,0,225),map(this.dna.attrFood, -5,5,0,225),0);
    textSize(20);
    text(floor(this.HP), this.pos.x, this.pos.y-10)
    text(this.name, this.pos.x, this.pos.y+40);

    //draws animal (as a triangle)
    var angle = this.vel.heading() + PI/2;
    // fill(127);
    strokeWeight(1);
    

    //creating safe space to translate and rotate without affecting other images
    push();

    //controlling position and rotation of future drawn image
    translate(this.pos.x,this.pos.y); //doing actual positioning of future drawn image
    rotate(angle);
    
    //showing attraction
    // stroke(0,225,0);
    // line(0,0,0,-this.dna.attrFood*20);

    // stroke(225,0,0);
    // line(0,0,0,-this.dna.attrPoison*20);

    stroke(200);
    //drawing image

    beginShape();
    vertex(0, -this.r*2);
    vertex(-this.r, this.r*2);
    vertex(this.r, this.r*2);
    endShape(CLOSE);

    if(ring){
        //showing perception radius
        noFill();
        stroke(0,225,0);
        ellipse(0,0,this.dna.fRadius*2);
        
        stroke(225,0,0);
        ellipse(0,0,this.dna.pRadius*2);
    }
    
    //coming out of safe space
    pop();
}

Animal.prototype.dead = function(){
    return this.HP<1;
}

Animal.prototype.replicate = function(){
    var dna = {
        "attrFood" : this.dna.attrFood + random(-1,1),
        "attrPoison" : this.dna.attrPoison + random(-1,1),
        "fRadius" : this.dna.fRadius + random(-10,10),
        "pRadius" : this.dna.pRadius + random(-10,10),
        "gen": this.dna.gen + 1
    }
    var daughterHP = this.HP * 0.25;
    this.HP = this.HP * 0.75;
    if(daughterHP < 10){
        daughterHP = 10;
    }
    return new Animal(this.pos.x, this.pos.y, daughterHP,dna, this.name);
}