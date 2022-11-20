const express = require('express')
const bodyparser = require("body-parser")
const cors = require("cors")
const app = express()
const bcrypt = require('bcryptjs')

const mysql = require('mysql')

app.use(cors());
app.use(bodyparser.json());

const db = mysql.createConnection({
    user: "homehealth2022",
    host: "home-health-1.cq5vn6zebgoo.us-east-2.rds.amazonaws.com",
    password: "", //!!!!!!!!!NEVER PUSH CODE WITH THE PASSWORD!!!!!!!!!!!
    database: "central_db"

});


app.post('/users', async(req, res) => {
    
    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt) //hash the password
        
        
        qr = `SELECT * FROM n_Auth WHERE email = "${req.body.email}"`
        //checks if the user exists
        db.query(qr, (err, result) => {
        
            if (err) {
                console.log(err);
    
            }
            if (result.length < 1) {  //user does not exist
                console.log("did not find a user with that log in");

                db.query('INSERT INTO n_Auth (lastName, firstName, email, password, roleLevel) VALUES (?, ?, ?, ?, ?)',
                    [req.body.lname, req.body.fname, req.body.email, hashedPassword, req.body.role]
                    ,(err, result) => {
                        
                        if (err) {
                            console.log(err);
                            res.status(500).send()
                        }
                        
                        res.send({
                            status: "200",
                        })

                    }) 

            }
            else { 
                res.send({
                    status: "400",
                    message: "found a user with that log in"
                })
                console.log('found a user with that log in')
            }
        })
        
        
    }
    catch {
        res.status(500).send()
    }

    

 })


 app.post('/users/login', async(req, res) => {
    //query the db to find user
   
    qr = `SELECT * FROM n_Auth WHERE email = "${req.body.email}"`
    db.query(qr, async(err, result) => {
       if (err) {
           console.log(err);
           //res.status(500).send()
       }
       if (result.length > 0) {
           
           try {
               if (await bcrypt.compare(req.body.password, result[0].password)) {
                   res.send({
                       status: "200",
                       firstname: result[0].firstName,
                       lastname: result[0].lastName,
                       role: result[0].roleLevel,
                       orgId: result[0].orgId
                   })
                  //res.status(200).send()
               }
               else {
                   res.send({
                       status: "400",
                       message: "incorrect password"
                   })
               }
           }
           catch {
               res.status(500).send()
           }
       }
       else {
           res.send({
               status: "400",
               message: "incorrect email"
           })

       }
   })
   
    
})

app.post('/get-restaurants', async(req, res) => {
    //query the db to find user
   
    qr = "SELECT * FROM n_Restaurants"
    

    db.query(qr, (err, result) => {
        if (err) {
            console.log(err);
        }

        if (result.length > 0) {
            res.send({
                status:'200',
                data:result
            })
        }
        else {
            res.send({
                status: '400'
            })
        }
    })
   
    
})

app.post('/add-restaurants', async(req, res) => {
    //query the db to find user
    const name = req.body.name;
    const cuisine = req.body.cuisine;
    const phone = req.body.phone;
   
    
   
    
    
    db.query('INSERT INTO n_Restaurants (Name, Cuisine, Phone) VALUES (?, ?, ?)',
    [name, cuisine, phone]
    , (err, result) => {
        if (err) {
            console.log(err);
        }

        if (result.length > 0) {
            res.send({
                status:'200',
                data:result
            })
        }
        else {
            res.send({
                status: '400'
            })
        }
    })
    
   
    
})

app.post('/getReviews', async(req, res) => {
    //query the db to find user
    
    const restaurant = req.body.restaurant;
    qr = `SELECT * FROM n_Reviews WHERE Restaurant = "${restaurant}"`

    db.query(qr, (err, result) => {
        if (err) {
            console.log(err);
        }

        if (result.length > 0) {
            res.send({
                status:'200',
                data:result
            })
        }
        else {
            res.send({
                status: '400'
            })
        }
    })



})

app.post('/addReviews', async(req, res) => {
    //query the db to find user
    const Taste = req.body.Taste;
    const restaurant = req.body.restaurant;
    const Price = req.body.Price;
    const Planet = req.body.Planet;
    const Atmosphere = req.body.Atmosphere;
    const Comments = req.body.Comments;

   
    
   
    
    
    db.query('INSERT INTO n_Reviews (Restaurant, Taste, Atmosphere, Price, Planet, Comments) VALUES (?, ?, ?, ?, ?, ?)',
    [restaurant, Taste, Price, Planet, Atmosphere, Comments]
    , (err, result) => {
        if (err) {
            console.log(err);
        }

        if (result.length > 0) {
            res.send({
                status:'200',
                data:result
            })
        }
        else {
            res.send({
                status: '400'
            })
        }
    })
    
   
    
})

app.listen(3001, () => {
    console.log("Server Running")
})