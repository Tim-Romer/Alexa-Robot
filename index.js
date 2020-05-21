/* Modified and repurposed by:
 * Author : Tim Romer
 * Date : 5-11-2020
 * Assignment : Final Project
 * Course : CSE 451 - Web Services
 */

// Including the required libraries.
const AWS = require('aws-sdk');
const Alexa = require('ask-sdk-core');
const http = require('https');

// Global variables to prevent the robot from moving beyond the board.
const max = 200;
const min = 0;

// Launch Request intent handler
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to the Alexa Skills Kit, you can say hello!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  }
};

// Handler that will get the robots current position and orientation.
const GetRobotPositionHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetPositionIntent';
  },
  handle(handlerInput) {
    return new Promise((resolve, reject) => {
      getHttp("https://1r1ksy5oqg.execute-api.us-east-1.amazonaws.com/default/robot/position")
        .then(response => {
          console.log(response);
          var json = JSON.parse(response);
          var x = json.robot.Item.X;
          var y = json.robot.Item.Y;
          var orientation = json.robot.Item.Orientation;
          const speechText = 'The robot is at X coordinate ' + x + ' and y coordinate ' + y + ' and facing ' + orientation;
          resolve(handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse()); 
          }).catch(error => {
            console.log(error);
            reject(handlerInput.responseBuilder
              .speak('An error occured')
              .getResponse()); 
          });
    });
  }
};

// Handler that will update the robots current position.
const MoveRobotPositionHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'MovePositionIntent';
  },
  handle(handlerInput) {
    return new Promise((resolve, reject) => {
      const host = "1r1ksy5oqg.execute-api.us-east-1.amazonaws.com";
      const path = "/default/robot/position";

      var orientation = Alexa.getSlotValue(handlerInput.requestEnvelope, 'orientation');
      var distance = 0;
      var x = 0;
      var y = 0;

      console.log("Orientation to move: " + orientation);
      console.log("Begin getting coordinate values");

      getCurrentCoordinates()
        .then(response => {
          console.log(response);

          // Depending on the input of distance, update the value accordingly.
          if (!Alexa.getSlotValue(handlerInput.requestEnvelope, 'distance')) {
            distance = 0;
          } else {
            distance = parseInt(Alexa.getSlotValue(handlerInput.requestEnvelope, 'distance'), 10);
          }

          // Depending on the current/proposed orientation, adjust the new coordinates
          if (orientation === "east") {
            x = (-1) * distance;
            orientation = "E";
          } else if (orientation === "west") {
            x = distance;
            orientation = "W";
          } else if (orientation === "north") {
            y = distance;
            orientation = "N";
          } else if (orientation === "south") {
            y = (-1) * distance;
            orientation = "S";
          } else if (orientation === "forward" || !orientation) {
            orientation = response.Orientation;
            if (orientation === "E") {
              x = (-1) * distance;
            } else if (orientation === "W") {
              x = distance;
            } else if (orientation === "N") {
              y = distance;
            } else if (orientation === "S") {
              y = (-1) * distance;
            } else {
              // If the database produces a bad value, throw an error.
              reject(handlerInput.responseBuilder
                .speak('An error has occured. Invalid orientation input from dynamodb.')
                .reprompt('An error has occured. Invalid orientation input from dynamodb.')
                .getResponse()); 
            }
          } else {
            // If another input comes from the alexa input, throw an error.
            reject(handlerInput.responseBuilder
                .speak('An error has occured. Invalid orientation input from alexa.')
                .reprompt('An error has occured. Invalid orientation input from alexa.')
                .getResponse()); 
          }

          // Put the request body together with the new coordinate data and orientation.
          const data = {
            "robot" : "Bob", 
            "X" : response.X + x, 
            "Y" : response.Y + y, 
            "Orientation" : orientation
          };

          console.log(data);

          // Check the new proposed coordinates against the global maximum and minimum. 
          // If the data is beyond the bounds, throw error and don't update database.
          if (data.X > max || data.Y > max || data.X < min || data.Y < min) {
            reject(handlerInput.responseBuilder
                .speak('An error has occured')
                .reprompt('An error has occured')
                .getResponse()); 
          }

          // Call the http post request. If successful, let the user know, or throw them
          // an error.
          postHttp(host, path, data)
            .then(response=> {
              console.log(response);
              const speechText = "The robot\'s position has been successfully updated";
              resolve(handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(speechText)
                .getResponse()); 
            }).catch(error => {
              console.log(error);
              reject(handlerInput.responseBuilder
                .speak('An error has occured')
                .reprompt('An error has occured')
                .getResponse()); 
            });
        }).catch(error => {
          console.log(error);
          reject(error);
        });
    });
  }
}

// Help intent handler
const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  }
};

// Cancel and Stop intent handler
const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .withShouldEndSession(true)
      .getResponse();
  }
};

// Session End intent handler
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    //any cleanup logic goes here
    return handlerInput.responseBuilder.getResponse();
  }
};

// Error intent handler
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log('Error handled: ' + error);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

// This will make a get request to the api gateway to get the current robot coordinates.
function getCurrentCoordinates() {
  return new Promise((resolve, reject) => {
  getHttp("https://1r1ksy5oqg.execute-api.us-east-1.amazonaws.com/default/robot/position")
    .then(response => {
      console.log(response);
      var json = JSON.parse(response);
      var x = json.robot.Item.X;
      var y = json.robot.Item.Y;
      var orientation = json.robot.Item.Orientation;
      resolve({'X' : x, 'Y' : y, 'Orientation' : orientation});
    }).catch(error => {
      console.log(error);
      reject(error);
    });
  });
}

// https://developer.amazon.com/blogs/alexa/post/28368692-a0b9-4579-b129-e6793bef7848/alexa-skill-recipe-update-making-http-requests-to-get-data-from-an-external-api-using-the-ask-software-development-kit-for-node-js-version-2
// This function will make a get request to the api gateway to get the current robot
// coordinates. The above url was the inspiration to making this function. It teaches
// you how to make api calls using promises in an alexa skill.
function getHttp(url) {
  return new Promise((resolve, reject) => {
    const request = http.get(url, response => {
      response.setEncoding('utf8');

      let returnData = '';
      if (response.statusCode != 200) {
        return reject(response);
      }

      response.on('data', chunk => {
        returnData += chunk;
      });

      response.on('end', () => {
        resolve(returnData);
      });

      response.on('error', error=> {
        reject(error);
      });
    });
    request.end();
  });
}

// https://nodejs.dev/make-an-http-post-request-using-nodejs
// This function will make a post request to update the robots coordinates.
// The above url was the inspiration on sending the a post request which
// includes a body.
function postHttp(host, path, data) {
  return new Promise((resolve, reject) => {
    const options = {
      host : host,
      path : path,
      method : 'POST'
    }
    const request = http.request(options, response => {
      response.setEncoding('utf8');
      console.log(response);
      let returnData = '';
      if (response.statusCode != 200) {
        return reject(response);
      }

      response.on('data', chunk => {
        returnData += chunk;
      });

      response.on('end', () => {
        resolve(returnData);
      });

      response.on('error', error=> {
        reject(error);
      });
    });
    request.write(JSON.stringify(data));
    request.end();
  });
}

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    GetRobotPositionHandler,
    MoveRobotPositionHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    ErrorHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
