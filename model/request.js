const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')



const RequestSchema = new mongoose.Schema (
    {  
        rider_id: {type:String, unique: true},
        rider_name: {type:String},
        rider_email: {type:String},
        rider_gender: {type: String},
        rider_phone: {type:String},
        driver_id: {type:String},
        driver_name: {type:String},
        driver_email: {type:String},
        driver_gender: {type:String},
        driver_phone: {type:String},
        driver_pickup: {type:String},
        driver_destination : {type:String},
        driver_platenum : {type:String},
        driver_departure : {type:String},
	      driver_message : {type:String},
		    driver_time : {type:String},
        driver_seats : {type:String},
        driver_score: {type:Number},
        status: {type: String}
        //destination: {type: String },
       // seats:  {type: String },
        //departure:  {type: String },
        //pickup:  {type: String },
        //platenum:  {type: String },
        //message :  {type: String },
        //time : { type : Date, default: Date.now }
      },
      {collection: 'requests'} 
    
      

)



RequestSchema.plugin(uniqueValidator)


const model = mongoose.model('Request', RequestSchema)

module.exports = model
