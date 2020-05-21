/*
   Scott Campbell
   Robot Drawing Library
   Y is north
   X is east

   RobotQueue -> manage robots
   Robot -> individual robot

   Robot has:
   name
   X
   Y
   Orientation
   Old robot position


 */

var ctx
var canvas
let width=50
let height = 50;
let canvasWidth=1200
let canvasHeight = 1150
let canvasOffset=100
let head =20 

/*
   One robotqueue per program
   it handles updating all robots in the queue
 */

class RobotQueue{
	constructor() {
		this.robotQueue = [];
	}

	//called to add a new robot to the queue
	addRobot(robot) {
		this.robotQueue.push(robot);
		console.log("Add",this.robotQueue);
	}

	//called by timer to update all robots
	drawAll() {
		let len = this.robotQueue.length;
		for (let i=0;i<len;i++) {
			this.robotQueue[i].drawRobot();
		}
	}

	//update given robot's position
	updateRobot(name,newPos) {
		let len = this.robotQueue.length;
		for(let i=0;i<len;i++) {
			var r=this.robotQueue[i];
			if (r.getName() == name)
			{
				r.update(newPos);
				return;
			}
		}
		console.log("Error -> update robot not in queue");
	}


}

//hold information for one robot
class Robot {
	constructor(name,color) {
		this.name = name;
		this.X=0;
		this.Y=0;
		this.orientation='N';
		this.color = color; 
		this.oldX = 0;
		this.oldY = 0;
		this.oldOrientation = 0;
		console.log("New robot",this);
	}

	getName() {
		return this.name;
	}

	getX() {
		return this.X;
	}
	getY() {
		return this.Y;
	}
	getOrientation() {
		return this.orientation;
	}

	update(r) {
		this.X=r.X;
		this.Y=r.Y;
		this.orientation= r.orientation;
	}

	//external function -> call this one to draw robot, it erases old position and draws new position
	drawRobot() {
		if (this.X != this.oldX || this.Y != this.oldY || this.oldOrientation != this.orientation) {
			this.drawMe(this.oldX,this.oldY,this.oldOrientation,"#aaaaaa");
			this.oldX=this.X;
			this.oldY=this.Y
				this.oldOrientation = this.orientation;
		}
		this.drawMe(this.X,this.Y,this.orientation,this.color);
	}

	//actual draw function -> private function
	drawMe(xIn,yIn,orientationIn,color) {
		ctx.fillStyle =color;
		var x=xIn*5+100;
		var y=(canvasHeight-(yIn*5+100));
		ctx.fillRect(x,y,width,height);
		if (orientationIn=="N")
			ctx.fillRect(x+width/2-head/2,y-head,head,head);
		else if (orientationIn == "S")
			ctx.fillRect(x+width/2-head/2,y+width,head,head);
		else if (orientationIn == "W")
			ctx.fillRect(x-head,y+width/2-head/2,head,head);
		else if (orientationIn == "E")
			ctx.fillRect(x+width,y+width/2-head/2,head,head);
	}
}


$(document).ready(() => {
		console.log("ready");
		canvas = document.getElementById("canvas");
		ctx = canvas.getContext("2d");
		ctx.fillStyle = "#aaaaaa";
		ctx.fillRect(0, 0,canvasWidth ,canvasHeight);
		setInterval(displayUpdate,50);
		})




var robotQueue = new RobotQueue();
//called by timer to update/draw robots
function displayUpdate() {
	robotQueue.drawAll();
}
