var Animal = function(x,y){
    this.pos = createVector(x,y);
    this.vel = createVector(0,-2); //??
    this.acc = createVector(0,0);
    this.r = 6; //size of animal
    this.maxSpeed = 5;
    this.maxForce = 0.5;
    this.HP = 50;

    this.dna = {
        "attrFood":random(-5,5),
        "attrPoison":random(-5,5)
    }

    this.detriment;

    if(Math.random()>.15){
        //normal food eater
        this.foodGain = 5;
        this.poisonGain = -28;
    }else{
        //poison eater
        this.foodGain = -28;
        this.poisonGain = 5;
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
        var closestInx = -1; //will pop out using index
        for (var i = 0; i<allFood.length;i++){
            var d = this.pos.dist(allFood[i].pos);
            if(d < shortest){
                shortest = d;
                closestInx = i;
            }
        } 

        if(shortest < 5){ //eating occurs
            if(allFood[closestInx].type == "food"){
                this.HP += this.foodGain;
            }else{
                this.HP -= this.poisonGain;
            }
            allFood.splice(closestInx,1);
        }else if (closestInx != -1){
            this.steering(allFood[closestInx]);
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

Animal.prototype.draw = function(){
    //updates position before drawing
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed); //limiting speed of movement
    this.pos.add(this.vel);//actually using internal info to make the change to the x and y-coordinates
    this.acc.mult(0);//resets acceleration to 0, so that it doesn't keep adding each seek() call

    //Forcing it center if off map
    if(this.pos.x>width || this.pos.x <0 ||this.pos.y>height||this.pos.y<0 || this.HP<1){
        this.pos.x = width/2;
        this.pos.y = height/2;
        if(this.HP<1){ //dead
            this.HP=50;
            this.dna = {
                "attrFood":random(-5,5),
                "attrPoison":random(-5,5)
            }
        }
    }

    //draws HP
    fill(map(this.HP, 100,0,0,225),map(this.HP, 0,100,0,225),0);

    textSize(20);
    text(floor(this.HP), this.pos.x, this.pos.y-10)

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
    stroke(0,225,0);
    line(0,0,0,-this.dna.attrFood*20);

    stroke(225,0,0);
    line(0,0,0,-this.dna.attrPoison*20);
  
    stroke(200);
    //drawing image
    beginShape();
    vertex(0, -this.r*2);
    vertex(-this.r, this.r*2);
    vertex(this.r, this.r*2);
    endShape(CLOSE);

    //coming out of safe space
    pop();
}