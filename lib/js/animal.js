var Animal = function(x,y){
    this.pos = createVector(x,y);
    this.vel = createVector(0,-2); //??
    this.acc = createVector(0,0);
    this.r = 6; //size of animal
    this.maxSpeed = 5;
    this.maxForce = 0.5;
    this.HP = 10;

    this.dna = {
        "attrFood":random(-5,5),
        "attrPoison":random(-5,5)
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
        var shortest = Infinity;
        var closestInx = -1; //will pop out using index
        for (var i = 0; i<allFood.length;i++){
            var d = this.pos.dist(allFood[i].pos);
            if(d < shortest){
                shortest = d;
                closestInx = i;
            }
        } 

        if(shortest < 5){
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

    //draws animal (as a triangle)
    var angle = this.vel.heading() + PI/2;
    fill(127);
    stroke(200);
    strokeWeight(1);
    
    //creating safe space to translate and rotate without affecting other images
    push();

    //controlling position and rotation of future drawn image
    translate(this.pos.x,this.pos.y); //doing actual positioning of future drawn image
    rotate(angle);
    
    //drawing image
    beginShape();
    vertex(0, -this.r*2);
    vertex(-this.r, this.r*2);
    vertex(this.r, this.r*2);
    endShape(CLOSE);

    //coming out of safe space
    pop();
}