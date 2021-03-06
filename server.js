const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./database/database-configuration');
const users = require('./routes/user'); 
const okrs = require('./routes/okr');
const capabilities = require('./routes/capability');
const User = require('./database/User');
const OKR = require('./database/OKR');
const Capability = require('./database/Capability');

const emailList = require('./email');

mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);

const app = express();
app.use(passport.initialize());
require('./passport')(passport);
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/users', users);
app.use('/api/okrs', okrs);
app.use('/api/capabilities',capabilities);


// New User
//  var newUser=new User({
//    email: "adi_postelnicu@metrosystems.net",
//    password: "password",
//    full_name: "Adi Postelnicu",
//    job_name: "Manager",
//    admin: true
//  });

//  newUser.save(function(err) {
//        if (err) {
//          console.log("Nu s-a reusit scrierea in baza de date")
//          console.log(err)
//        }
//        else{
//          console.log("Scriere in baza de date reusita")
//        }
//      });

// New User
//  var newUser=new User({
//    email: "t-c.solca@metrosystems.net",
//    password: "password",
//    full_name: "Solca Teodor",
//    job_name: "Programmer",
//    admin: false
//  });

//  newUser.save(function(err) {
//        if (err) {
//          console.log("Nu s-a reusit scrierea in baza de date")
//          console.log(err)
//        }
//        else{
//          console.log("Scriere in baza de date reusita")
//        }
//      });

// New OKR
// var newOKR= new OKR({
//       okr_name : "OKR 2",
//       okr_description : "Lorem Ipsum este pur şi simplu o machetă pentru text a industriei tipografice. Lorem Ipsum a fost macheta standard a industriei încă din secolul al XVI-lea, când un tipograf anonim a luat o planşetă de litere şi le-a amestecat pentru a crea o carte demonstrativă pentru literele respective. Nu doar că a supravieţuit timp de cinci secole, dar şi a facut saltul în tipografia electronică practic neschimbată. A fost popularizată în anii '60 odată cu ieşirea colilor Letraset care conţineau pasaje Lorem Ipsum, iar mai recent, prin programele de publicare pentru calculator, ca Aldus PageMaker care includeau versiuni de Lorem Ipsum.",
//       okr_price : 2500,
//       okr_owner : "Adrian Postelnicu",
//       okr_comments: []
// });

// newOKR.save(function(err) {
//        if (err) {
//          console.log("Nu s-a reusit scrierea in baza de date")
//          console.log(err)
//        }
//        else{
//          console.log("Scriere in baza de date reusita")
//        }
//      });

// New Capability
// var newCapability= new Capability({
//   adminId: "5bb20ee36c2ce914d0c96597",
//     name: "Business Solution Analysis",
//     budget: 100000,
//     categories: [{ 
//         name: "Traveling",
//         description: "Traveling",
//         budget: "10000",
//         list_of_expenses: [],
//         requests:[]
//     },
//     { 
//       name: "Training",
//       description: "Training",
//       budget: "10000",
//       list_of_expenses: [],
//       requests:[]
//     },
//     { 
//     name: "Telecommunication",
//     description: "Telecommunication",
//     budget: "10000",
//     list_of_expenses: [],
//     requests:[]
//     },
//     { 
//       name: "Materials",
//       description: "Materials",
//       budget: "10000",
//       list_of_expenses: [],
//       requests:[]
//     },
//     { 
//       name: "Team building and team events",
//       description: "Team building and team events",
//       budget: "10000",
//       list_of_expenses: [],
//       requests:[]
//     }],

// });

// newCapability.save(function(err) {
//        if (err) {
//          console.log("Nu s-a reusit scrierea in baza de date")
//          console.log(err)
//        }
//        else{
//          console.log("Scriere in baza de date reusita")
//        }

//      });

// console.log("**** Am n useri :",emailList.length);

// emailList.map(function(userData,index){
// // New User
//  let newUser=new User({
//    email: userData.email,
//    password: userData.password,
//    full_name: userData.full_name,
//    job_name: userData.job_name,
//    admin: userData.admin
//  });

//  newUser.save(function(err) {
//        if (err) {
//          console.log("Nu s-a reusit scrierea in baza de date")
//          console.log(err)
//        }
//        else{
//          console.log("Scriere in baza de date reusita, elementul : ",index+1)
//        }
//      });
// })


app.get('/api/hello', (req, res) => {
  res.send({ express: 'Metro Systems - Objectives and key results' });
});

app.listen(port, () => console.log(`Listening on port ${port}`));