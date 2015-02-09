# Pebble Coding Challenge
Node.js coding challenge made for Pebble Technology co-op application, Summer 2015 (getpebble.com)

Hey Pebble! Thanks for this awesome opportunity to join your team.

As requested, my project is comprised of the following:
- A webapp that is able to listen to the first person's computer’s microphone and push commands to the server.
- A Node.js server that will receive commands from all the clients and console.log the order in which buttons are pressed as well as the phrase “Free them!” once all buttons have been pressed in the correct order.
- A webapp that will tell the people in the remaining rooms when to hit the button.
- Websockets (socket.io) for client-server communication
- An explain how you would scale the situation out to multiple groups of rooms all with different orders that the buttons need to be pressed (written below)
- Bonus: an outline of how I would structure and write unit tests for these applications

## Running the code
1. Run ` npm install `.
2. Run ` node index `.

This will boot up the two apps. The code is structured such that both express apps are in the in the index.js file because it isn't much code.
This may be abstracted out at a later date, given how complex and how in need of separation the code gets.

` trappedApp ` is the app run by the individuals trapped in Rooms 1-4, and ` commanderApp ` is the app controlled by voice commands.
The `trappedApp` runs on port 3000. `commanderApp` runs on port 8080.
Make sure to open localhost:3000 on different browsers (not tabs) to simulate the four users as cookies are used to 'assign' a room ID.

Open localhost:8080 in any browser and then start to speak as follows. Note that the order of rooms can change.
Annyang doesn't play nicely with background noise so I decided to console log the current running order in which the rooms should press their buttons.
As a result, after saying "Room 1", wait until the console logs the order.
Numbers other than those from 1 to 4 will be ignored and the console will indicate as such.
I assume here that the console is visible to the commander so he knows when his commands are registered and when to continue.
If that's not the case, I would integrate [say](https://www.npmjs.com/package/say) so that the commander can hear it.

After the entire order is heard, the room first on the commander's list has the "Don't click yet." warning to "Click now."
Upon clicking, the next user is notified, and so on and so forth.
Once the last user in the list has clicked, the console will print "Free them!" and the user will be notified with "You're free!"

However, if at any point the button is clicked out of order (or a button is clicked prior to any commander directions having hit the system),
the console will print "They're trapped forever" and the user will see "You're trapped forever!" Blame room {x}", where 'x' is the person who caused the order to be incorrect.








