const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')


const mongo_url="mongodb+srv://nasa-api:E50GLUXU4aW3vZkk@nasacluster.wtqu2do.mongodb.net/yoga_project?retryWrites=true&w=majority"


user_info=mongoose.Schema({
    email:String,
    user_name:String,
    password:String,
    age:Number,
    batch:String
})


user_info.pre("save", function (next) {
    const user = this
  
    if (this.isModified("password") || this.isNew) {
      bcrypt.genSalt(10, function (saltError, salt) {
        if (saltError) {
          return next(saltError)
        } else {
          bcrypt.hash(user.password, salt, function(hashError, hash) {
            if (hashError) {
              return next(hashError)
            }
  
            user.password = hash
            next()
          })
        }
      })
    } else {
      return next()
    }
  })

//   UserSchema.methods.comparePassword = function(password, callback) {
//     bcrypt.compare(password, this.password, function(error, isMatch) {
//       if (error) {
//         return callback(error)
//       } else {
//         callback(null, isMatch)
//       }
//     })
//   }

const user_model=mongoose.model('User',user_info)

async function conenctMongo(){
    await mongoose.connect(mongo_url)
}


mongoose.connection.once('open',(req,res)=>{
    console.log("connected with database")
})

mongoose.connection.on('error',(req,res)=>{
    console.log("error in connecting with database")
})





module.exports={
  user_model,
   conenctMongo,
}