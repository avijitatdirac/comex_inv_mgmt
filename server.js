var express = require('express')
var app=express()

var mysql=require('mysql')

var connection=mysql.createConnection({
  host:'localhost' ,
  user:'root' ,
  password: '',
  database: 'inventory'

})

app.listen(8081,function()
{
    console.log('server started on port 8081')
})


app.get(`/insert_customer`,(req,res)=>
{
    var qry="insert into Customer(CName,Contact_No,Contact_person,Email,Address,Address1,Address2,City,State,Pincode) values(?,?,?,?,?,?,?,?,?,?)"
    var qry1="select Customer_Id from Customer where Customer_Id=(SELECT MAX(Customer_Id) from Customer)"
    var qry2=`insert into Customer_Financial(Customer_Detail_Id,Account_Number,IFSC_Code,Bank_Name,Account_Name,GST_Details,HSN_Code,SAC_Code) values ((${qry1}),?,?,?,?,?,?,?)`
    var qry3=`insert into Customer_Location_Detail(Customer_Id,Location,Contact_No,Contact_person,Email,Address,Address1,Address2,City,State,Pincode,Bill_To_Address,Bill_To_Address1,Bill_To_Address2,Ship_To_Address,Ship_To_Address1,Ship_To_Address2) values((${qry1}),?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`    
    var cname               =req.query.CName
    var contact_no          =req.query.Contact_No
    var contact_person      =req.query.Contact_person
    var email               =req.query.Email
    var address             =req.query.Address
    var address1            =req.query.Address1
    var address2            =req.query.Address2
    var city                =req.query.City
    var state               =req.query.State
    var pincode             =req.query.Pincode
    var account_Number      =req.query.accountNumber
    var iFSC_Code           =req.query.ifscCode
    var bank_Name           =req.query.bankName
    var account_Name        =req.query.accountName
    var gST_Details         =req.query.gstDetails
    var hSN_Code            =req.query.hsnCode
    var sAC_Code            =req.query.sacCode
    var location            =req.query.location
    var bill_To_Address     =req.query.billToAddress     
    var bill_To_Address1    =req.query.billToAddress1
    var bill_To_Address2    =req.query.billToAddress2
    var ship_To_Address     =req.query.shipToAddress
    var ship_To_Address1    =req.query.shipToAddress1
    var ship_To_Address2    =req.query.shipToAddress2
    console.log('request: ')
    console.log(req.query)
    connection.query(qry,[cname,contact_no,contact_person,email,address,address1,address2,city,state,pincode],(error,results,fields)=>
{
    if(error){
        console.log('Error: ')
        console.log(error)
if(error.errno===1062){
    res.status(503).json({isError:true,message: 'Email id already Exists'});
    return;
}
    }
else{
res.status(200).json({isError:false});
connection.query(qry2,[account_Number,iFSC_Code,bank_Name,account_Name,gST_Details,hSN_Code,sAC_Code])

connection.query(qry3,[location,contact_no,contact_person,email,address,address1,address2,city,state,pincode,bill_To_Address,bill_To_Address1,bill_To_Address2,ship_To_Address,ship_To_Address1,ship_To_Address2])
}
  //  return;
})

})

app.get(`/get_all`,(req,res)=>
{
   var qry="select * from Customer";
   connection.query(qry,(error,results,fields)=>
   {
       if(error) {
           res.status(503).json({
               message:'failure' ,
               isError:'true'
           })
       } 

         if(results && results.length>0) {
             var cname=results[0].CName
            console.log('result is : '+results[0].CName);
            response.status(200).json({
                message: 'success',
                cname:cname
            })
            }

   })

})