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

This will boot up the two apps. Both Express.js apps are in the `index.js` file, however this may be abstracted out into two files given how complex the code becomes.

` trappedApp ` is the app run by the individuals trapped in Rooms 1-4, and ` commanderApp ` is the app controlled by voice commands.
The `trappedApp` runs on port 3000. `commanderApp` runs on port 8080.

We assume here that each room has one instance of localhost:3000 running, and rooms are identified by URL path. For example, Room 1 will run localhost:3000/1, Room 2 will run localhost:3000/2, and so on and so forth. You may open four tabs each with the different routes and have no problems testing the project's functionality. It is assumed that only one of each route is being hit at a given time for simplicity. If this is not the case, only the tab that has opened the given route most recently will work.

All buttons are originally disabled until the room order has been recorded and confirmed by the commander. After that time, all buttons become active - this adds a little excitement as there is a chance to press the buttons in the wrong order. We can easily change this by only emitting 'activate buttons' to target the specific socket so that the button only becomes active when it's the appropriate person's turn. 

Annyang is far from perfect so I decided to log the current running order in which the rooms should press their buttons, in addition to creating a replica of that console as the view for the commander app. Full instructions on how to run the commander app are written in the view file itself, including which commands are permitted under which conditions.

## Scaling to multiple groups

Socket.io makes it relatively simple to scale this situation out to multiple groups.

Socket.io allows us to add specific sockets to "rooms" (henceforth referred to as "groups") and on connect, we can run socket.join('some group').

That 'some group' can be indicated by the URL that the client uses. For example, each person trapped in a room would access the URL localhost:3000/:groupNum/:roomNum to uniquely identify themselves, and each 'commander' would access a URL localhost:3000/:groupNum. We could then connect each socket to the appropriate group. Groups are created automatically in socket.io so there is no need to declare each group before its creation.

Whenever we need to emit events, we can simply write something like this: io.to('group number of this socket').emit('some event'), where 'io' would either be trappedIO or commanderIO as necessary. This encapsulates the emissions and allows different groups to operate in parallel (without interconnection).

In terms of tracking the order in which the buttons must be pressed, I would likely choose Redis lists to track what I call the 'orderArray' of individual groups' required click sequence. We would be widely under-employing Redis' full capability, but it is well suited for frequently updated real-time data and is becoming relatively easy to scale given Cluster Support, both of which are assets given the nature of this application. However, based on the specific context under which this application will be used and how far it will be scaled, we must consider if RAM capacity will be an issue.

## Tests
Unit test declarations were outlined with Mocha for both web apps. Although the implementation of each is not complete, the desired functions have been described and the creation of beforeEach and afterEach() hooks for each test were written with the consultation of [this resource](http://stackoverflow.com/questions/15509231/unit-testing-node-js-and-websockets-socket-io). This automates the connection and disconnection of multiple sockets as necessary for testing purposes.
