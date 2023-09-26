// const mongoose = require('mongoose'); // Mongoose for communicating with mongoDB
// const DataModel=require('./models/data') // Mongoose Model to store Payment Details(go to the file path to see)
const request = require('request');
const express=require('express')
const bodyParser=require('body-parser')
const port=3001
const app=express()
const cors=require('cors')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors())

/* Connect to mongoDB to store payment Details
const mongodburl="" //Your mongoDB Url
mongoose.connect(mongodburl,{
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});
*/

app.post('/accept-payment',(req,res)=>{
    const {amount,currency,email,first_name,last_name,phone_number,tx_ref}=req.body
    var options = {
        'method': 'POST',
        'url': 'https://api.chapa.co/v1/transaction/initialize',
        'headers': {
          'Authorization': 'CHAPA-AUTH-KEY',//Replace 'CHAPA-AUTH-KEY' with your Chapa Auth Key from https://dashboard.chapa.co/dashboard/profile/api
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "amount": amount,
          "currency": currency,
          "email": email,
          "first_name": first_name,
          "last_name": last_name,
          "phone_number": phone_number,
          "tx_ref": tx_ref,
          "return_url": "http://localhost:3000", //Url to Return once payment is completed
          "customization[title]": "Payment"
        })
      
      };
      request(options, function (error, response) {
        if (error){
            res.json({error:error})
            return
        }  
        res.json({success:response})

        /* Store Payment Details in MongoDB
        const model={
            amount:amount,
            currency:currency,
            email:email,
            first_name:first_name,
            last_name:last_name,
            phone_number:phone_number,
            tx_ref:tx_ref,
        }
        const data=new DataModel(model)
        data.save()
        .then((resp)=>{
              res.json({dbsuccess:resp})
        }).catch((err)=>{
              res.json({error:err})
        })*/
      });
})

app.listen(port,()=>{
    console.log(`Server Listening on Port ${port}`)
})

