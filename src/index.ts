import express from "express";
import * as http from "http";
import path from "path";
import socketIo from "socket.io";

const app = express();
const httpServer = http.createServer(app);
const io = socketIo(httpServer);
const port = 3000;

// Configure Express to use EJS
app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "ejs" );

app.use(express.static(path.join(__dirname, "public")));

// define a route handler for the default home page
app.get("/", (req, res) => {
  res.render("index");
});

// start the Express server
httpServer.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});

io.on("connection", (socket) => {
  // tslint:disable-next-line:no-console
  console.log("a user connected");
});
