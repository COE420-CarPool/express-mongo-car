const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./model/user')
const Message = require('./model/message')
const Request = require('./model/request')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
var session = require('express-session')
const dateTime = require("simple-datetime-formater");
var MongoStore = require('connect-mongo')(session)

//const io = require("socket.io");
const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'
mongoose.connect('mongodb://localhost:27017/carPool', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
})
const app = express()
app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

var http = require("http").Server(app);
var io=require('socket.io')(http);
app.use(session({
    name: 'session',
    secret: "userSess",
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));



app.post('/api/login', async (req, res) => {
	const { email, password } = req.body
	let user = await User.findOne({ email: req.body.email })

	if (!user) {
		return res.json({ status: 'error', error: 'User does not exist' })
	}

	else if (await bcrypt.compare(password, user.password)) {
		// the email, password combination is successful

		console.log("User logged in successfuly")
		req.session.isLoggedIn = true;
		req.session.userId = user._id;
		const token = jwt.sign(
			{
				id: user._id,
				email: user.email
			},
			JWT_SECRET
		)
		if (user.userType == "rider")
		{
		return res.json({ status: 'rider', data: token })
		}
		else if (user.userType == "driver")
		{ return res.json({ status: 'driver', data: token })
	     }
		
	}
	else {
		return res.json({ status: 'error', error: 'Wrong password' })
	}


})

app.get('/dashboard', async (req, res) =>
{
	res.sendFile('change-password.html')
})
 
app.post('/api/register', async (req, res) => {
	const { email, name, phone, gender, userType, password: plainTextPassword } = req.body
	const score = 0
	if (!email || typeof email !== 'string') {
		return res.json({ status: 'error', error: 'Invalid email' })
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 4) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	 password = await bcrypt.hash(plainTextPassword, 10)

	try {
		const response = await User.create({
			email,
			name,
			gender,
			phone,
			score,
			userType,
			password
		})
		
	res.json({ status: 'ok' })
		console.log('User created successfully: ', response)
		
	} catch (error) {
		console.log('Email ALREADY EXISTS.');
		console.log(error);
		res.send(error);
		throw(error)
		
	}

}) 

//--------------------------------- MESSAGES now

app.post('/logOut', async (req, res) => {
	console.log("logout beign callleeddd")
	if (req.session.isLoggedIn) { req.session.isLoggedIn = false
	console.log("User logged out!")}
		else {console.log("huuuh?")}

})
app.get('/messages', async (req, res) => {
	let user = await User.findOne({_id:req.session.userId})
	if (user.userType ==="rider"){
	Message.find({},(err, messages)=> {
	  res.send(messages);
	  console.log("showing all messages to rider")
	})}
	else if (user.userType === "driver") { res.send("Not authorized!"); console.log ("a driver trying to view messages. not allowed.")}
  })
  
  app.post('/requestMatch', async (req, res) => {
	if (req.session.isLoggedIn)
	{ let user = await User.findOne ({_id : req.session.userId})
	console.log('Rider requested Match: ' + user.name)
	
	var request = new Request();
	
		request.rider_id = user._id,
		request.rider_email = user.email,
		request.rider_name = user.name,
		request.rider_phone = user.phone,
		request.rider_gender = user.gender,
		request.driver_id = req.body.creator_id,
		request.driver_email = req.body.creator_email,
		request.driver_phone = req.body.creator_phone,
		request.driver_name = req.body.creator_name,
		request.driver_destination = req.body.destination,
		request.driver_pickup = req.body.pickup,
		request.driver_platenum = req.body.platenum,
		request.driver_departure = req.body.departure,
		request.driver_message = req.body.message,
		request.driver_time = req.body.time,
		request.driver_seats = req.body.seats,
		request.driver_score = req.body.score,
		
		request.status = "pending";
	  var request = await request.save()
	  
	}

  })

  app.post('/Match', async (req, res) => {
	if (req.session.isLoggedIn)
	{ 
	let user = await User.findOne ({_id : req.session.userId}) 
	if (user.userType === "driver"){
	//console.log('Driver who accepted Match is: ' + user.name)
	
	console.log("Request updated~~");
	const user = await User.updateOne({ _id: req.session.userId}, { $inc: { score: 1 } })
	const request = await Request.updateOne({ driver_id: req.session.userId }, { status: "confirmed" })
	const request2 = await Request.updateOne({ driver_id: req.session.userId }, { $inc: { driver_score: 1 } })

	}
	//let request = await Request.findOne({driver_id: user._id})
	 // request.status = "confirmed"
  }
  })

  app.get('/viewRequests', async (req, res) => {
	let user = await User.findOne({_id:req.session.userId})
	if (user.userType === "driver"){
	Request.find({'driver_id':req.session.userId},(err, requests)=> {
		res.send(requests);
		console.log("getting requests")
  }) }
  else if (user.userType === "rider"){
	console.log("rider triyng to view requests. not allowed!")
  }
})

app.get('/rideHistory', async (req, res) => {
	let user = await User.findOne({_id:req.session.userId})
	if (user.userType ==="driver"){
	Request.find({'driver_id':req.session.userId, 'status':'confirmed'},(err, requests)=> {
		res.send(requests);
		console.log("getting ride history to driver") 

  })  }
  else if (user.userType === "rider") {
	Request.find({'rider_id':req.session.userId, 'status':'confirmed'},(err, requests)=> {
		res.send(requests);
		console.log("getting ride history to rider") 

  }) 
  }

  })
  
  app.get('/messages/:user', (req, res) => {
	var user = req.params.user
	Message.find({name: user},(err, messages)=> {
	  res.send(messages);
	  console.log("getting /messages/:user")
	})
  })
  
  
  app.post('/messages', async (req, res) => {
	  console.log("posting message")
	  if (req.session.isLoggedIn) 
	{
		let user = await User.findOne({ _id: req.session.userId })
		if (user.userType === "driver") {
	try{
	  var message = new Message(req.body);
		message.creator_id = user._id
		message.creator_email = user.email
		message.creator_name = user.name
		message.creator_phone = user.phone
		message.creator_gender = user.gender 
		message.score = user.score
		console.log(message.creator_gender)
	  var savedMessage = await message.save()
		console.log('saved');
  
	  var censored = await Message.findOne({message:'badword'});
		if(censored)
		  await Message.remove({_id: censored.id})
		else
		  io.emit('message', req.body);
		res.sendStatus(200);
	}
	catch (error){
	  res.sendStatus(500);
	  return console.log('error',error);
	}
	finally{
	  console.log('Message Posted')
	}
} }
  })
  

  io.on('connection', () =>{
	console.log('a user is connected')
  })
//------------

var server = http.listen(3222, () => {
	console.log('server is running on port', server.address().port);
  });
  
