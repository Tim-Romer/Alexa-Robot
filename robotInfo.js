/* 
 * Author : Tim Romer
 * Date : 5-11-2020
 * Assignment : Final Project
 * Course : CSE 451 - Web Services
 */

async function getRobotPosition() {
 	var x = 0;
 	var y = 0;
 	var orientation = "";

 	// Ajax request to the api gateway
 	var request = await $.ajax({
 		method: "GET",
 		url: "https://1r1ksy5oqg.execute-api.us-east-1.amazonaws.com/default/robot/position",
 		dataType: "json"
 	}).done(function(data) {
 		x = data.robot.Item.X;
 		y = data.robot.Item.Y;
 		orientation = data.robot.Item.Orientation;
 	}).fail(function(err) {
 		console.log(err);
 	});

 	// Return the required details to update the robot on the screen.
 	return {'X' : x, 'Y' : y, 'orientation' : orientation};
 }