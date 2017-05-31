// 1. Import the express module
import express from "express";

// 12. import bodyparser middleware
//     yarn add body-paser
import bodyParser from "body-parser";

// 14. import mongoose
// yarn add mongoose
import mongoose from "mongoose";

// 17. import models
import User from "./models/User.js";

// 15.  odbc
// http://mongoosejs.com/docs/index.html

mongoose.connect('mongodb://localhost/q2-contact-list');

// http://mongoosejs.com/docs/connections.html
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("mongoDB connected");
});

// 2. Create a new instance of express
const app = express();

// 13. use bodyparser middleware with express
app.use(bodyParser.json());


// 8.   db of users
// const users = [
//   {
//     id: 1,
//     name: 'Dale Cooper'
//   },
//   {
//     id: 2,
//     name: 'Spike Spiegel'
//   }
// ];


// 3. Set our port to server the application on
const PORT = 8001;


// 6. / route
app.get("/", (request, response) => {
  console.log("/route was called");
  return response.json({
    that: "works for /"
  });
});


// 5. users route
app.get('/users', (request, response) => {
//  console.log("/users route was called ", users);

// user object is defined below from the POST
  User.find().exec()
  .then((data) => {
    return response.json(data);
  })
  .catch(err => {
    return console.log('fetching failed ', err);
    // return response.json('exectued');
  });
});


/* filtering the get

User.find({
  name: 'nick1'
}).exec()...


http://someurl.com/users?name=blitzen

"name" is the in the request

*/




//9. users/id
app.get('/users/:id', (request, response) => {

  User.findById(request.params.id).exec()
  .then ((user) => {
    return response.json(user);
  })
  .catch((err) =>{
    return console.log('Error', err);
  });
  // console.log(request.params.id);
  // // return response.json(null);
  // const foundUser = users.find((user) => {
  //   return String(user.id) === request.params.id
  // });
  // console.log(foundUser);
  // return response.json(foundUser || null);
});

// 14. delete
app.delete('/users/:id', (request, response) => {
 User.findByIdAndRemove(request.params.id).exec()
  .then((user) => {
    return response.json(user);
  })
  .catch((err) => {
    console.log('Error deleting ', err);
  });
});

// // 10.  post to users array
// app.post("/users", (request, response) => {
// //  console.log(request);
//   const user = {
//     id: users.length + 1,
//     ...request.body
//   };
//   users.push(user);
//   return response.json(user);
// });

app.post("/users", (request, response) => {
  // create user object first;  new instance of User
  const user = new User(request.body);

  user.save()  // promise
 .then(storedUser => {
   console.log('User was saved');
   return response.json(storedUser);
 })
 .catch(() => {
   console.log('User was NOT saved');
   return response.json('Executed')
 });
});


// 7.  default message route
app.get('/*', (request, response) => {
  return response.json({
    message:  "not implmented yet"
  });
});


// 4. Tell our instance of express to listen to request made on our port
app.listen(PORT, (err) => {
  if (err) {
    return console.log('Error!', err);  // error handler just in cases
  }
  return console.log('Listening on: http://localhost:' + PORT)
});
