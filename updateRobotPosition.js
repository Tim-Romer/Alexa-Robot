/*
 * Author : Tim Romer
 * Date : 4-27-2020
 * Assignment : Lambda Project - Update Lambda Function
 * Course : CSE 451 - Web Services
 *
 * Lambda skill to update the robots position
 */

var AWS = require("aws-sdk");

//main entry point
exports.handler = (event,context,callback) => {

    AWS.config.update({
      region: "us-east-1"
    });
    
    var docClient = new AWS.DynamoDB.DocumentClient();
    
    var table = "RobotPositions";
    var robot = "Bob";
    var x = 0;
    var y = 0;
    var orientation = "";
    
    console.log("Event Body", event);
    console.log(event.httpMethod);
    if (event.httpMethod == 'POST' || event.method == 'POST') {
        
        var j= event.body;
        console.log('HELLO', event.body, j['robot'], j.X);
        j = JSON.parse(j);
        robot = j.robot;
        x = j.X;
        y = j.Y;
        orientation = j.Orientation;
    }
    
    console.log(robot, x, y, orientation);
    
    // Update the item, unconditionally,
    
    var params = {
        TableName:table,
        Key:{
            "robot": robot
        },
        UpdateExpression: "set X = :x, Y = :y, Orientation = :orientation",
        ExpressionAttributeValues:{
            ":x":x,
            ":y":y,
            ":orientation":orientation
        },
        ReturnValues:"UPDATED_NEW"
    };
    
    console.log("Updating the item...");
    docClient.update(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            const response = {
                statusCode: 500
            }
            callback(null,response);
        } else {
            console.log("Query succeeded.");
            const response = {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }
            };
            callback(null,response);
        }
    });
}
