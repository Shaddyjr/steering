var Food = function(x, y){
    this.type = Math.random()>.65? "poison" : "food";
    this.pos = createVector(x,y);
}

Food.prototype.draw = function(){
    fill(this.type == "food"? "green" : "red");
    noStroke();
    ellipse(this.pos.x, this.pos.y, 10, 10);
}