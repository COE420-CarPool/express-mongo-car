const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'

mongoose.connect('mongodb://localhost:27017/login-app-db', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
})

const app = express()
app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())


app.post('/api/change-password', async (req, res) => {
	const { token, newpassword: plainTextPassword } = req.body

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	try {
		const user = jwt.verify(token, JWT_SECRET)

		const _id = user.id

		const password = await bcrypt.hash(plainTextPassword, 10)

		await User.updateOne(
			{ _id },
			{
				$set: { password }
			}
		)
		res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: ';))' })
	}
})

app.post('/api/login', async (req, res) => {
	const { email, password } = req.body
	let user = await User.findOne({ email: req.body.email })

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid email/password' })
	}

	else if (await bcrypt.compare(password, user.password)) {
		// the email, password combination is successful
		console.log("User logged in successfuly")
		const token = jwt.sign(
			{
				id: user._id,
				email: user.email
			},
			JWT_SECRET
		)
		
		return res.json({ status: 'ok', data: token })
	}


})

app.get('/dashboard', async (req, res) =>
{
	res.sendFile('change-password.html')
})
 
app.post('/api/register', async (req, res) => {
	const { email, name, phone, userType, password: plainTextPassword } = req.body

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
			phone,
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

app.listen(9999, () => {
	console.log('Server up at 9999')
})
