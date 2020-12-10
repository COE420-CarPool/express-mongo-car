const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')

const UserSchema = new mongoose.Schema(
	{
		email: { type: String, required: true, unique: true },
		name: {type: String, required:true},
		phone: {type: String},
		userType: {type:String},
		gender: {type:String},
		password: { type: String, required: true },
		score: {type:Number}
	},
	{ collection: 'users' }

)
/*
var Rider = new mongoose.Schema({
	name:{type:mongoose.Schema.Types.ObjectId, ref:'Name'},
	onCampus: {type: Boolean}
	
})

var Driver = new mongoose.Schema({
    name:{type:mongoose.Schema.Types.ObjectId, ref:'Name'},
	plateNumber: {type: String, required: true},
	carModel: {type: String, required: true}
})
*/
UserSchema.plugin(uniqueValidator)


const model = mongoose.model('UserSchema', UserSchema)

module.exports = model
