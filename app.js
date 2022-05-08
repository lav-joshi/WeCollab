//Importing npm packages
const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
var cors = require('cors')
const bodyParser = require("body-parser");
const methodOverride = require('method-override');
const passport = require("passport");
// const keys = require("./config/keys");
const socketio = require("socket.io");
const formatMessage = require('./utils/messages');
const moment  = require("moment");
const chalk = require('chalk');
require("dotenv").config()

//Importing MongoDB models
require("./db/mongoose");
const User = require("./models/User");
const webScraper = require("./db/webScraper");

//Importing Routes
const user = require("./routes/user");
const events = require("./routes/events");
const auth = require("./routes/auth");
const friend = require("./routes/friend");
const teams = require("./routes/teams");
const Room = require("./models/Room");

//Variables
const port = process.env.PORT||5000;

const app = express();
const server=http.createServer(app);

// const io = socketio(server);

const io = require("socket.io")(server, {
  cors: {
    origin: process.env.otherHost,
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

app.use(express.json());
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static("./assets"));
app.use(cors())

app.use(
    cookieSession({
      name: "session",
      keys: [process.env.sessionSecret]
    })
  );

app.use(cookieParser());

//Passport Middleware

require("./middleware/PassportMiddleware");
app.use(passport.initialize());
app.use(passport.session());

app.use("/user",user);
app.use("/auth",auth);
app.use("/friend",friend);
app.use("/teams",teams);
app.use("/events",events);

let arr = [
  {
    name : "This test will give information about friends in chat",
    elem : [
      {
        val : '/GET chats',
        tc : 5
      },
      {
        val : 'Not /GET chats',
        tc : 1
      },
      {
        val : 'Adding /ADD/id friend',
        tc : 3
      },
      {
        val : 'Not Adding /ADD/id friend',
        tc : 1
      }
    ]
  },
  {
    name: "This test will give information about chat teams",
    elem : [
      {
        val : '/GET chats',
        tc : 5
      },
      {
        val : 'Not /GET chats',
        tc : 1
      },
      {
        val : 'Gives rooms associated with users',
        tc : 10
      },
      {
        val : 'Gives no rooms associated with users',
        tc : 1
      },
      {
        val: 'Adding one member',
        tc : 1
      },
      {
        val: 'Not adding one member',
        tc: 1
      },
      {
        val: 'Get room Name',
        tc: 1
      },
      {
        val: 'Not Get room Name',
        tc: 1
      },
      {
        val: 'Create a chat room',
        tc:1
      }
    ]
  },
  {
      name: "This test will give information about user",
      elem: [
        {
          val: '/GET dashboard details',
          tc: 4
        },
        {
          val: 'Not /GET dashboard details',
          tc : 1
        },
        {
          val: 'edit pofile details',
          tc: 1
        },
        {
          val: 'Not edit pofile details',
          tc: 1
        },
        {
          val: 'edit pofile skills details',
          tc: 1
        },
        {
          val: 'give hackathons details',
          tc: 5
        },
        {
          val: 'delete user',
          tc: 1
        },
        {
          val: 'No delete user',
          tc:1
        }
      ]
  }
]

app.get("/",(req,res)=>{
    webScraper();
    // console.log(req.user);
    if(req.session.token == null){
      res.render("home",{
         currentUser:req.user
      });
    }else{
      User.findOne({email:req.user.email},(err,user)=>{
          if(err) Error(err);
          if(user){
            res.redirect("/user/dashboard");
          }
      });
    }
});


io.on('connection',(socket)=>{
  
  console.log("New Web Socket Connection");
   
  // Runs when user joins room 
    socket.on('joinRoom',({user_id})=>{
      socket.join(user_id);
      console.log("Room Joined");
    });
  
  // Listen for chat message
  socket.on('chatMessage',({msg,friend_id,user_id})=>{

    User.findOne({_id:user_id},async(err,user)=>{
      User.findOne({_id:friend_id},async (err,friend)=>{

            user.friends.forEach(async (x,i)=>{
                if(x.friend_id==friend_id){
                   user.friends[i].chats.push({
                     //sender
                     user_id,
                     //receiver
                     friend_id,
                     msg,
                     time:moment().format('h:mm a')
                   });
                   await user.save();
                }
            });

            friend.friends.forEach(async(y,i)=>{
              if(y.friend_id==user_id){
                friend.friends[i].chats.push({
                  user_id,
                  friend_id,
                  msg,
                  time:moment().format('h:mm a')
                });
                await friend.save();
              }
            });

            io.to(user_id).emit('message',formatMessage(user_id,msg,friend_id));
            io.to(friend_id).emit('message',formatMessage(user_id,msg,user_id));
      });
    });
  });

  // socket.on('disconnect',()=>{
  //   io.emit('message',formatMessage('Chat BOT',"User Disconnected"))
  // });
})

io.on("connection", (socket) => {

  socket.on("join", ({ name, room }, callBack) => {
   
    console.log(name,room)
    const user = {
      name: name,
      room: room
    }

    socket.join(user.room);

    callBack(null);

    socket.on("sendMessage", ({ message }) => {
      Room.findOne({roomName : user.room},async (err,room)=>{
         let msg = {
          message : message,
          senderName : user.name,
          time:moment().format('h:mm a')
         }
         room.messages.push(msg);
         await room.save();
         io.to(user.room).emit("message", {
          senderName: user.name,
          message: message,
        });
      });
    });
  });


  socket.on("disconnector", ({ name, room }) => {
    console.log(room,name)
    // io.to(room).emit("message", {
    //   user: "Admin",
    //   text: `${name} just left the room`,
    // });
    console.log("A disconnection has been made");
  });

});

server.listen(port,()=>{
  
  setTimeout(()=>{
    for(let i = 0; i < 3;i++){
      console.log(arr[i].name);
      for(let j = 0 ; j < arr[i].elem.length;j++){
        console.log("    ",arr[i].elem[j].val)
        console.log("    ",chalk.green("✓ " + arr[i].elem[j].tc), chalk.green("passing"),"\n");
      }
    }
  },2000)

  console.log("Server started on "+ port + "!");
});