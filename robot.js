/*
   Scott Campbell
   cse451 final project
   This is a TEST file to invoke the robotDrawing.

   1) 
   create new robot:

   var bob  = new Robot("Bob","#ff0000") -> color at end is color to draw bob
   robotQueue.add(bob);

   update bob's position with an object:
   pos = {X:10,Y:10,orientation:"N"}
   robotQueue.updatePosition("Bob",pos);

   the robotDrawins page has its own timer for drawing the robots.



 */

var bob;
var alice;
var testPositions=[];
var max =200 

$(document).ready(() => {
	// Creating a new robot
	bob = new Robot("Bob","#ff0000");

	// Add the robot to the robot queue
	robotQueue.addRobot(bob);

	// Call the update function to continuously update the web browser
	setInterval(update,1000);
});

// This function will constantly call the get Robot Position function
// to get the robots current position.
async function update() {
	var pos = await getRobotPosition();
	console.log("Lambda", pos);
	robotQueue.updateRobot("Bob",pos);
} 

