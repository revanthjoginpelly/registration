
const express=require('express')
const {user_model}=require('../mongoose')
const bcrypt=require('bcryptjs')


const app=express()



const signinRouter=express.Router()

signinRouter.get('/',(req,res)=>{
    res.render('signin1');
})

async function find(filter){
    return user_model.findOne(filter);
}

signinRouter.post('/',async(req,res)=>{
    const email=req.body.email
    const filter={email}

    const user=await find(filter);
    //console.log(user)

    if(!user){
       
        const alert=['not found user']
       return res.render('signin1',{
        alert
       })
      //return res.status(400).send('not found user')
    }

    else{
         
        try{
            if(await bcrypt.compare(req.body.password,user.password)){
                const email=req.body.email
                res.redirect(`/users/:${email}`)
            }
            else{
                const alert=['incorrect passowrd']
                return res.render('signin1',{
                    alert
                   })
            }

        } 
        catch{
            res.status(500).send('error');
        }
    }
})
module.exports={
    signinRouter,
}
