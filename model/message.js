const mongoose = require('mongoose')
//var uniqueValidator = require('mongoose-unique-validator')



const MessageSchema = new mongoose.Schema (
    {
        destination: {type: String },
        seats:  {type: String },
        departure:  {type: String },
        pickup:  {type: String },
        platenum:  {type: String, unique:true },
        message :  {type: String },
        time : { type : Date, default: Date.now }
      },
      {collection: 'messages'} 
    
      

)



//Message.plugin(uniqueValidator)


const model = mongoose.model('Message', MessageSchema)

module.exports = model
