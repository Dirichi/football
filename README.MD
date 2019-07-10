## FOOTBALL

This repository contains source code for a multiplayer, multi-process football game. It is multiplayer in the sense that multiple users can participate in a single game at the same time, and multi-process in the sense that the application can run multiple games concurrently. The project is written in Typescript, and is run on a node server with very few dependencies on the backend. A more in depth review of the architecture is not yet available but will be soon.

### RUNNING LOCALLY

Some prerequistes before running the game locally:
- Install git and update it if you haven't already. Instructions [here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
- Install npm and/or node and update them if you haven't already. Instructions [here](https://www.npmjs.com/get-npm).

To get the game running locally, open your terminal / command line. Then clone this repository to get all the code, by typing in the following command:

> ```git clone https://github.com/Dirichi/football.git```

Next, cd into the directory where the code has been downloaded

> ```cd football```

Then run the following command to download all the dependencies required by the project

> ```npm install```

When all the above commands complete without any errors, to get the game going, run the following command:

> ```npm run dev```

You should see some output on your terminal while the app compiles in preparation for running. Eventually you see something like `server started at http://localhost:3000`.

When you see this, open chrome and visit localhost:3000. Wait for about 5 seconds for the game to actually start and try out the direction controls to control the keeper of the blue team. Enjoy!

### TESTING

This project is liberally tested (lol). To run tests:

> ```npm run test```

### LEARNING RESOURCES

- Check out [tutorialspoint](https://www.tutorialspoint.com/typescript/) for a Typescript tutorial.
- Check out [p5js](http://p5js.org/learn/) to learn about animation on the web.
- Checkout [w3schools](https://www.w3schools.com/nodejs/) for a tutorial on nodejs.
