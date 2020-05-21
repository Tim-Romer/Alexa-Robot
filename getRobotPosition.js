/* Modified and repurposed by:
 * Author : Tim Romer
 * Date : 5-11-2020
 * Assignment : Final Project
 * Course : CSE 451 - Web Services
 *
 * This node.js code is a lambda skill to get the robots current position.
 */
var AWS = require("aws-sdk");

//main entry point
exports.handler = (event,context,callback) => {
    
    AWS.config.update({
        region: "us-east-1",
    });

    //default robot
    var robot = "Bob";
    
    console.log(robot);

    var docClient = new AWS.DynamoDB.DocumentClient();
    if (event.httpMethod == 'POST') {
        console.log("Event Body", event.body);
        var j=JSON.parse(event.body);
        robot = j.robot;
    } else {
        //setup for parsing path parameter
        console.log("test of path parameters",event.pathParameters==null);
        if ((typeof event.pathParameters !== 'undefined' )  && event.pathParameters != null && typeof event.pathParameters.year !== 'undefined') {
            try {
                robot = event.pathParameters.robot;
            } catch ( err) {
                const response = {
                    statusCode: 500
                };
                console.log("can't parse year",event.pathParameters.year);
                console.log("event",event);
                callback(null,response);
            }
        }
    }
    
    var params = {
        TableName: "RobotPositions",
        Key : {
            "robot" : robot
        }
    };
    console.log("params", params);

    //make call and on callbacks, return response
    docClient.get(params, function(err, data) {
        console.log("making call");
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            const response = {
                statusCode: 500
            };
            callback(null,response);
        }
        else {
            console.log("Query succeeded.");
            console.log(data);
            const response = {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({ "robot": data }),
            };
            callback(null,response);

        }
    });
};
