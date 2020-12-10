const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')



const MessageSchema = new mongoose.Schema (
    {
        creator_id: {type:String, unique:true},
        creator_name: {type:String},
        creator_email: {type:String},
        creator_gender: {type:String},
        creator_phone: {type:String},
      
        destination: {type: String },
        score: {type:Number},
        seats:  {type: String },
        departure:  {type: String },
        pickup:  {type: String },
        platenum:  {type: String },
        message :  {type: String },
        time : { type : Date, default: Date.now }
      },
      {collection: 'messages'} 
    
      

)



MessageSchema.plugin(uniqueValidator)


const model = mongoose.model('Message', MessageSchema)

module.exports = model
