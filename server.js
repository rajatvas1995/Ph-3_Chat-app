const mongoose = require("mongoose");
var Message = require("./models/message");
var url = "mongodb://127.0.0.1/mydb";

mongoose.connect(url).then((ans) => {
    console.log("connected successful & folder created")
}).catch((err) => {
    console.log("Error in connection")
})

const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname+"/Public")));

io.on("connection", function(socket){
    socket.on("newuser", function(username){
        socket.broadcast.emit("update", username + " joined the conversation");
    });
    socket.on("exituser", function(username){
        socket.broadcast.emit("update", username + " left the conversation");
    });

    socket.on("chat", function(message){
        socket.broadcast.emit("chat", message);
        // // push to DB//
        Message.create(message).then(function (message) {
        console.log("send create reqbody user");
        console.log(message);
        });
    
      });
      app.post('/messages', (req, res) => {
        var message = new Message(req.body);
        if(req.body.message=='Save')
        message.save((err) =>{
          if(err){
            sendStatus(500);
        }
        else{
          res.sendStatus(200);
        }
        });

        app.get('/messages', (req, res) => {
          Message.find({},(err, messages)=> {
            if(err){
              res.send(err);
            }else{
              res.send(messages);
            }
            
          })
        })
      })
});
///

///
server.listen(3000);