# Alexa-Robot
## Introduction
An alexa skill that will allow the user to move a robot through alexa and have the new position update in a web browser. This project 
was completed inplace of a final exam for CSE 451: Web Services. The instructor was Dr. Scott Campbell.

## Technologies
* Node.js
* AWS
  * Lambda
  * API-Gateway
  * Alexa
  * DynamoDB
* HTML
* JS
* CSS

## Status
The project meets the current requirements for the ‘B’ grade of the rubric. The user can interact with the robot via an alexa enabled device with the skill loaded onto it. The robots position can be seen from the web browser from an html page stored in an S3 bucket. You can move the robot in north, south, east, and west directions. You can move it any amount of distance as long it stays within the 200x200 box.

In the project write up, the example interactions show that you can turn the robot. The way I implemented this was that you can tell the robot to move a certain direction 0 units. The instructions also show how much further you can move the robot forward. Since my robot can simultaneously turn and move, I assumed that the user knows how far in each direction the robot can move. The user can get the current robots position and figure out where to move it. 

This project does not contain the functionality that would earn it an A grade. I unfortunately could not dedicate the time to get it to that level due to my strenuous finals week and having to move during this week.

## Voice Interactions
GetPositionIntent: This will return the robot’s current position.
“Alexa ask romerta robot what is the position”
“Alexa ask romerta robot what the position is”
“Alexa ask romerta robot get the position”

MovePositionIntent: This intent allows the user to update the robot’s current position.
“Alexa ask romerta robot to move the robot {distance} units”
“Alexa ask romerta robot to move the robot {direction} {distance} units”

## API Gateway CURL
Get current coordinates:

$ curl -X GET https://1r1ksy5oqg.execute-api.us-east-1.amazonaws.com/default/robot/position

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
  
                                 Dload  Upload   Total   Spent    Left  Speed
                                 
100    66  100    66    0     0    108      0 --:--:-- --:--:-- --:--:--   108

{"robot":{"Item":{"Y":40,"Orientation":"W","robot":"Bob","X":50}}}

Post new coordinates:

$ curl -d '{"robot" : "Bob", "X" : 70, "Y" : 40, "Orientation" : "W"}' -X POST https://1r1ksy5oqg.execute-api.us-east-1.amazonaws.com/default/robot/position

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
  
                                 Dload  Upload   Total   Spent    Left  Speed
                                 
100    58    0     0  100    58      0     23  0:00:02  0:00:02 --:--:--    23


## Lambda Skills Name
AlexaRobot : The lambda function that serves as the endpoint for the Alexa Skill
getRobotPosition: The lambda function will query the dynamodb table to retrieve the current (X,Y) position of the robot and the orientation.
updateRobotPosition: The lambda function that will update the dynamodb table to update the geographic coordinates and orientation for the robot.

## API Gateway Name
RobotFinal

## Alexa Developer Console Test Runs
![Alexa Test 1](https://github.com/Tim-Romer/Alexa-Robot/alexa_test1.PNG)

![Alexa Test 2](https://github.com/Tim-Romer/Alexa-Robot/alexa_test2.PNG)

![Alexa Test 3](https://github.com/Tim-Romer/Alexa-Robot/alexa_test3.PNG)

## HTML w3c Validation
![w3c](https://github.com/Tim-Romer/Alexa-Robot/w3c_validation.PNG)

## Video Demonstration
[![Alexa Video](http://img.youtube.com/vi/Pfbc1qADMDE/0.jpg)](https://youtu.be/Pfbc1qADMDE "Alexa Robot Video Demonstration")



