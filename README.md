# Pebble Coding Challenge
Node.js coding challenge created for [Pebble Technology](http://getpebble.com)'s co-op term in Summer 2015.

Hey Pebble! Thanks for this awesome opportunity to join your team.

As requested, my project is comprised of the following:
- An Express.js web app that is able to listen to the first person's computer’s microphone using Annyang and push commands to the server.
- A Node.js server that will receive commands from all the clients and console.log the order in which buttons the are pressed as well as the phrase “Free them!” once all buttons have been pressed in the correct order.
- An Express.js web app that will tell the people in the remaining rooms when to hit the button.
- Websockets (socket.io) for client-server communication
- An explaination of how I would scale the situation out to multiple groups of rooms all with different orders that the buttons need to be pressed (written below)
- Bonus: an outline of how I would structure and write unit tests for these applications

## Running the code
1. Run ` npm install `.
2. Run ` node index `.

This will boot up the two apps. The code is structured such that both Express.js apps are in the in the `index.js` file because it isn't much code.
This may be abstracted out at a later date, given how complex and how in need of separation the code gets.

` trappedApp ` is the app run by the individuals trapped in Rooms 1-4, and ` commanderApp ` is the app controlled by voice commands.
The `trappedApp` runs on port 3000. `commanderApp` runs on port 8080.

We assume here that each room has an instance of localhost:3000 running, each with with path localhost:3000/:roomNum, corresponding to the room that the app is running in. Opening these in different tabs in the same browser will not cause a problem. It is assumed that only one of each route is being hit at a given time for simplicity. If this is not the case, only the tab that has opened the given route most recently will work.

Annyang doesn't play nicely with background noise so I decided to console log the current running order in which the rooms should press their buttons, in addition to creating a replica of that console as the view for the commander app. Full instructions on how to run the commander app are written in the view file itself, including which commands are permitted under a given set of conditions.
