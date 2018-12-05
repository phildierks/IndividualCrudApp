port = process.env.PORT || 80
console.log("hey");
const express = require('express');
const bodyParser= require('body-parser')
const app = express();
app.use(bodyParser.urlencoded({extended: true}))
const MongoClient = require('mongodb').MongoClient

var db
MongoClient.connect('mongodb://phildierks:4phillip@ds151943.mlab.com:51943/food', (err, client) => {
  if (err) return console.log(err)
   db = client.db('food')
   app.listen(port, () => {
     console.log('listening on 3000')
   })
   app.get('/', (req, res) => {
     var cursor = db.collection('food').find()
   })
   db.collection('food').find().toArray(function(err, result) {
     console.log(result)
   })
 })

 app.get('/', (req, res) => {
   db.collection('food').find().toArray((err, result) => {
     if (err) return console.log(err)
     res.render('index.ejs', {food: result})
   })
 })

 app.post('/food', (req, res) => {
   db.collection('food').find().toArray(function(err,result){
     var id = result.length+1
     var food = req.body.food
     var name = req.body.user
     db.collection('food').insertOne({name:name, food:food, id:id})
     console.log(result)
     res.redirect('/')
   })
})

app.post('/delete', function(req, res) {
  var id = parseInt(req.body.buttonId)
  console.log(id)
  db.collection("food").deleteOne({id:id})
  res.redirect("/")
})


app.post('/update', (req,res) => {
  var id = parseInt(req.body.buttonId2)
  db.collection('food').find({id:id}).toArray(function(err,result){
    var id1 = parseInt(req.body.buttonId2)
    console.log(result)
    var food = result[0].food
    var name = result[0].name
    console.log(food)
    console.log(id)
    res.render('edit.ejs', {name:name, food:food, editId:id1})
   })
});

app.post('/update2', function(req, res) {
  var Id = parseInt(req.body.editId)
  var newName = req.body.user
  var newFood = req.body.food
  console.log(Id)
  db.collection('food').updateOne({id:Id},
      { $set: {name:newName, food: newFood}},
       (err, res) => {
      if (err) throw err;
      console.log("updated");
    })
    res.redirect('/');
});
