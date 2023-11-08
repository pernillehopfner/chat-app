const express = require('express');
//const http = require('http');
const https = require('https');
const fs = require("fs");
const bcrypt = require('bcrypt');
const path = require("path");
const bodyParser = require('body-parser');
//const db = require('./database/database');
//const users = require('./data').userDB;
const db = require("./database/database")

const User = db.users

const app = express();
//const server = http.createServer(app);

// Certifikater
const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
}
const server = https.createServer(options, app);

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'')));

app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'index.html'));
});

// Registrering af medarbejder
app.post('/register', async (req, res) => {
    try{
        //let foundUser = users.find((data) => req.body.email === data.email);
        //if (!foundUser) {
    
            let hashPassword = await bcrypt.hash(req.body.password, 10);
    
            let newUser = {
                //id: Date.now(),
                username: req.body.username,
                email: req.body.email,
                password: hashPassword,
            };
            //users.push(newUser);
            const user = await User.create(newUser)
            //console.log('User list', users);
            //return res.status(201).send("./login.html");
            
            return res.send("<div align ='center'><h2>Registrering successful</h2></div><br><br><div align='center'><a href='./login.html'>login</a></div><br><br><div align='center'><a href='./registration.html'>Registrer en anden bruger</a></div>");
        } //else {
            //res.send("<div align ='center'><h2>Email allerede i brug</h2></div><br><br><div align='center'><a href='./registration.html'>Registrer igen</a></div>");
    //    }}
    catch(err){
        console.log(err);
    }
});

// Login af medarbejder
app.post('/login', async (req, res) => {
    //const email = req.body.email
    try{
        var foundUser = await User.findOne ({ 
            where: { email: req.body.email }
            });
            console.log(foundUser);

       if (foundUser) {
    
            //let submittedPass = req.body.password; 
            //let storedPass = foundUser.password; 
        //async (req, res) => {
          // const passwordMatch = await 
          // const match =
           bcrypt.compare(req.body.password, foundUser.password, function(err, result){
            console.log(result);
          
            if (result) {
               let usrname = foundUser.username;
                return res.status(201).send(`<div align ='center'><h2>Login accepteret</h2></div><br><br><br><div align ='center'><h3>Hello ${usrname}</h3></div><br><br><div align='center'><a href='./login.html'>Logud</a></div><br><br><div align='center'><a href='./public/chat.html'>CHATRUM</a></div>`);
            } else {
               res.send("<div align ='center'><h2>Ikke valid email eller kodeord</h2></div><br><br><div align ='center'><a href='./login.html'>Login igen</a></div>");
    }});
        }//}
     /*   else {
            let fakePass = `$2b$$10$ifgf`;
            await bcrypt.compare(req.body.password, fakePass);
            res.send("<div align ='center'><h2>Invalid email eller kodeord</h2></div><br><br><div align='center'><a href='./login.html'>Login igen<a><div>");
        } */
    } catch(err){
        console.log(err);
    }
});

// Videresendelse til socket.io
app.use(express.static(path.join(__dirname,'./public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

var io = require('socket.io')(server);

var name;

io.on('connection', (socket) => {
  console.log('new user connected');
  
  socket.on('joining msg', (username) => {
  	name = username;
  	io.emit('chat message', `---${name} joined the chat---`);
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.emit('chat message', `---${name} left the chat---`);
    
  });
  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', msg);         //Her sendes besked til alle udover selve afsenderen
  });
});

db.sequelize.sync().then(() => {
    console.log("Bruger tabel er oprettet")
}).catch((err) => {
    console.error("Der er sket en fej")
});

// Lytter til port 3000
server.listen(3000, function(){
    console.log("server is listening on port: 3000");
});
