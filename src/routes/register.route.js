
//const bodyParser = require('body-parser');
const express=require('express')
const {body, validationResult } = require('express-validator')
const{user_model}=require('../mongoose')
const bcrypt=require('bcryptjs');

const registerRouter=express.Router()

registerRouter.get('/',(req,res)=>{
    res.render('register');
})

async function find(filter){
   return  user_model.findOne(filter);
}


registerRouter.post('/',
 [
    body('name')
          .trim()
          .isLength(6)
           .withMessage('name must be length above 6 char'),
    body('email')
          .trim()
          .isEmail()
           .withMessage('email must be a vaild email')
          .normalizeEmail()
          .toLowerCase(),
    body('password')
       .trim()
       .isLength(8)
       .withMessage("password must be of length 8"),
    body('confirm-password').custom((value,{req})=>{
        if(value !=  req.body.password){
            throw new Error(' Password do not matches ')
        }
        return true;
    }
    ),
    body('age').custom((val,{req})=>{
        if(val<18 || val>65){
            throw new Error('Age must be betweem 18-65')
        }
        return true;
    }),
    body('response')
      .trim()
],
async(req,res)=>{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
           const alert=errors.array();
           res.render('register',{
            alert,
            email:req.body.email
           })
        }
    else{
        
        const email= req.body.email;
        const user=await find({email});

        if(!user){
            
            const newOne=new user_model({
                email:req.body.email,
                user_name:req.body.name,
                password:req.body.password,
                age:req.body.age,
                batch:req.body.response
            })
             newOne.save();
        }
        res.redirect('/')
        
    }
     
});
module.exports={
    registerRouter,
}