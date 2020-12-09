const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')



const RequestSchema = new mongoose.Schema (
    {  
        rider_id: {type:String, unique: true},
        rider_name: {type:String},
        rider_email: {type:String},
        rider_gender: {type: String},
        rider_phone: {type:String},
        rider_passengers: {type: String},
        rider_luggage: {type:String},
        rider_notes: {type:String},
        driver_id: {type:String},
        driver_name: {type:String},
        driver_email: {type:String},
        driver_gender: {type:String},
        driver_phone: {type:String},
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
