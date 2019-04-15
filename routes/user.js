const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const validateLoginInput = require('../validation/login');
const userEmailIsEmpty = require('../validation/is-empty');
const User = require('../database/User');

const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
         user: 'metrosystems.budget.app@gmail.com',
         pass: 'Password12345!@'
     }
 });
const capabilityRequestBody = require('../emails_body/capabilityRequestBody');

router.post('/login', (req, res) => {

    const { errors, isValid } = validateLoginInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
        .then(user => {
            if(!user) {
                errors.email = 'User not found'
                return res.status(404).json(errors);
            }
            bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if(isMatch) {
                            const payload = {
                                id: user.id,
                                full_name: user.full_name,
                                job_name: user.job_name,
                                admin: user.admin,
                                capabilities: user.capabilities,
                                hasPermissionToAddExpense: user.hasPermissionToAddExpense
                            }
                            jwt.sign(payload, 'secret', {
                                expiresIn: 3600
                            }, (err, token) => {
                                if(err) console.error('There is some error in token', err);
                                else {
                                    res.json({
                                        success: true,
                                        token: `${token}`
                                    });
                                }
                            });
                        }
                        else {
                            errors.password = 'Incorrect Password';
                            return res.status(400).json(errors);
                        }
                    });
        });
});

router.post('/loginWithIdam', (req, res) => {

  if(userEmailIsEmpty(req.body.userEmail)) {
      return res.status(400).json("No user email provided");
  }

  const email = req.body.userEmail;

  User.findOne({email}).then(
        function(user, err) {
          // Daca email-ul nu exista in baza locala a aplicatiei
                  // atunci se creeaza un user nou
                  if(!user) {
                    // New User
                    let _id_user= new mongoose.mongo.ObjectId();

                    let first_name = email.split('@')[0].split('.')[0];
                    first_name = first_name.charAt(0).toUpperCase() + first_name.slice(1);

                    let second_name = email.split('@')[0].split('.')[1];
                    second_name = second_name.charAt(0).toUpperCase() + second_name.slice(1);

                    const full_name = first_name + " " + second_name;

                    let newUser=new User({
                      _id: _id_user,
                      email: email,
                      password: '1234',
                      full_name: full_name,
                      job_name: 'Programmer',
                      admin: false,
                      capabilities: [],
                      hasPermissionToAddExpense: []
                    });

                    const payload = {
                        id: _id_user,
                        // email: email,
                        full_name: full_name,
                        job_name: 'Programmer',
                        admin: false,
                        capabilities: [],
                        hasPermissionToAddExpense: []
                    }

                    newUser.save(function(err) {
                          if (err) {
                            console.log("Nu s-a reusit scrierea in baza de date")
                            console.log(err)
                          }
                          else{
                            console.log("Scriere in baza de date reusita ")
                            jwt.sign(payload, 'secret', {
                              expiresIn: 3600
                            }, (err, token) => {
                              if(err) console.error('There is some error in token', err);
                              else {
                                  res.json({
                                      success: true,
                                      token: `${token}`
                                  });
                              }
                          });
                          }
                        });
                }

              // Daca am gasit user-ul
              if(user) {
                const payload = {
                    id: user.id,
                    full_name: user.full_name,
                    job_name: user.job_name,
                    admin: user.admin,
                    capabilities: user.capabilities,
                    hasPermissionToAddExpense: user.hasPermissionToAddExpense
                }
                jwt.sign(payload, 'secret', {
                    expiresIn: 3600
                }, (err, token) => {
                    if(err) console.error('There is some error in token', err);
                    else {
                        res.json({
                            success: true,
                            token: `${token}`
                        });
                    }
                });
            }
        });
    // )
      
});

router.get('/get_all_users', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      var decoded = jwt.decode(token, "secret");
      User.findOne({
        full_name: decoded.full_name
      }, function(err, user) {
          if (err) throw err;
  
          if (!user) {
            return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
          } else {
            User.find({},function(err, users){
                if(err) console.log(err);
                if(!users){
                  console.log("Nu s-au gasit niciun user!");
                }
                else{
                    var userMap = [];

                    users.forEach(function(user) {
                    userMap.push({_id: user._id,email: user.email, full_name:user.full_name, capabilities: user.capabilities, hasPermissionToAddExpense: user.hasPermissionToAddExpense});
                });

                  res.json({success:true, userMap});
                }
              })
          }
      });
    } else {
      return res.status(403).send({success: false, msg: 'No token provided.'});
    }
  });

  router.get('/get_all_managers', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);

    if (token) {
      var decoded = jwt.decode(token, "secret");
      User.findOne({
        full_name: decoded.full_name
      }, function(err, user) {
          if (err) throw err;
  
          if (!user) {
            return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
          } else {
            User.find({
              admin: true
            },function(err, users){
                if(err) console.log(err);
                if(!users){
                  console.log("Nu s-au gasit niciun user!");
                }
                else{
                    var userMap = [];

                    users.forEach(function(user) {
                    userMap.push({_id: user._id,email: user.email, full_name:user.full_name, capabilities: user.capabilities, hasPermissionToAddExpense: user.hasPermissionToAddExpense});
                });

                  res.json({success:true, userMap});
                }
              })
          }
      });
    } else {
      return res.status(403).send({success: false, msg: 'No token provided.'});
    }
  });

  router.post('/send_capability_request', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      var decoded = jwt.decode(token, "secret");
      User.findOne({
        full_name: decoded.full_name
      }, function(err, user) {
          if (err) throw err;
  
          if (!user) {
            return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
          } else {

            const userName = user.full_name;

            User.findOne({
              _id: req.body._id_manager
            },function(err, manager){
                if(err) console.log(err);
                if(!manager){
                  console.log("Nu s-au gasit niciun manager!");
                }
                else{
                    
                htmlBody= capabilityRequestBody(userName)
                let mailOptions = {
                  from: 'metrosystems.budget.app@gmail.com', // sender address
                  to: manager.email, // list of receivers
                  subject: userName+' requested to be added to a capability -Msys Budget App', // Subject line
                  text: userName + ' requested to be added to a capability', // plain text body
                  html: htmlBody // html body
              };
          
              transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                      return console.log(error);
                  }
                  console.log('Message sent: %s', info.messageId);
                  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
              });
                    }
                });

                  res.json({success:true});
                }
              })
          }
         else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
  });

  router.post('/update_user_capability', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      var decoded = jwt.decode(token, "secret");
      User.findOne({
        full_name: decoded.full_name
      }, function(err, user) {
          if (err) throw err;
  
          if (!user) {
            return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
          } else {
            User.find({},function(err, users){
                if(err) console.log(err);
                if(!users){
                  console.log("Nu s-au gasit niciun user!");
                }
                else{
                    User.update(
                        {"_id": req.body.id_user},
                        {

                        "$addToSet": {capabilities: req.body.capability_id}
                        },
                        {safe: true},
                        function(err, model) {
                        console.log(err);
                        }
                    )}
                });

                  res.json({success:true});
                }
              })
          }
         else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
  });

  router.post('/update_user_delete_capability', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      var decoded = jwt.decode(token, "secret");
      User.findOne({
        full_name: decoded.full_name
      }, function(err, user) {
          if (err) throw err;
  
          if (!user) {
            return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
          } else {
            User.find({},function(err, users){
                if(err) console.log(err);
                if(!users){
                  console.log("Nu s-au gasit niciun user!");
                }
                else{
                    User.update(
                        {"_id": req.body.id_user},
                        {

                        "$pull": {capabilities: req.body.capability_id}
                        },
                        {safe: true, upsert: true, multi: true},
                        function(err, model) {
                        console.log(err);
                        }
                    )}
                });

                  res.json({success:true});
                }
              })
          }
         else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
  });


router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
});

module.exports = router;