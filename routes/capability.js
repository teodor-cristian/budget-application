const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const validateLoginInput = require('../validation/login');
const Capability = require('../database/Capability');
const User = require('../database/User');

const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
         user: 'metrosystems.budget.app@gmail.com',
         pass: 'Password12345!@'
     }
 });
const newCommentBody = require('../emails_body/newCommentBody');
const newRequestBody = require('../emails_body/newRequestBody');
const managerResponseBody = require('../emails_body/managerResponseBody');
const managerRequestResponseBody = require('../emails_body/managerRequestResponseBody');


router.get('/get_all_capabilities', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    const errors = null;
    if (token) {
      var decoded = jwt.decode(token, "secret");
      User.findOne({
        full_name: decoded.full_name
      }, function(err, user) {
          if (err){
            errors.err=err;
            return res.status(400).json(errors);
            throw err;}
  
          if (!user) {
            // return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            errors.user="Authentication failed. User not found.";
            return res.status(400).json(errors);
          } else {
            Capability.find({ _id: { "$in" : user.capabilities} } ,function(err, capabilities){
                if(err) console.log(err);
                if(!capabilities){
                  console.log("Nu s-au gasit capabilitati pt acest user");
                  //res.status(403).send({msg: 'Nu s-au gasit capabilitati pt acest user'})
                  errors.noCapabilities="Nu s-au gasit capabilitati pt acest user";
                  return res.status(400).json(errors);
                }
                else{
                  res.json({success:true, capabilities});
                }
              })
          }
      });
    } else {
     // return res.status(403).send({success: false, msg: 'No token provided.'});
      errors.noToken="No token provided";
      return res.status(400).json(errors);
    }
  });

  router.post('/post_expense', passport.authenticate('jwt', { session: false}), function(req, res) {
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
            Capability.findOne({
              "_id": req.body._id_capabilitate
            }, function(err, capability){
              if(err) throw err;

              if(!capability){
                return res.status(403).send({success: false, msg: 'Capability not found.'});
              }
              else{
                // Deoarece stiu doar numele, voi cauta id-ul pentru categorie
                var cat_id;
                for(let i=0;i<capability.categories.length; i++){
                  if(capability.categories[i].name==req.body.newExpense.category_name)
                  {cat_id=capability.categories[i]._id;}
                }
                
                
                Capability.update(
                  {"_id": req.body._id_capabilitate,
                  "categories.name" : req.body.newExpense.category_name},
                    {
                      "$addToSet": {"list_of_expenses": {name: req.body.newExpense.name, 
                                                  description: req.body.newExpense.description, 
                                                  sum: req.body.newExpense.sum,
                                                  category_id: cat_id
                                                  }},
                      "$inc": {"categories.$.budget": -req.body.newExpense.sum}
                    },
                  {safe: true, upsert: true},
                  function(err, model) {
                  console.log(err);
                }
                  )
                
                  res.status(200).send({success: true, message: "It worked!"});
                
              }
            })
          }
      });
    } else {
      return res.status(403).send({success: false, msg: 'No token provided.'});
    }
  });



  router.post('/post_category', passport.authenticate('jwt', { session: false}), function(req, res) {
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
            Capability.update(
              {"_id": req.body._id_capabilitate},
                {
                  "$addToSet": {"categories": {name: req.body.newCategory.name, 
                                              description: req.body.newCategory.description, 
                                              budget: req.body.newCategory.budget,
                                              comments: []}}
                },
              {safe: true, upsert: true},
              function(err, model) {
              console.log(err);
            }
              )
              res.status(200).send({success: true, message: "It worked!"});

          }
      });
    } else {
      return res.status(403).send({success: false, msg: 'No token provided.'});
    }
  });





// ************************************************************************************************************************
// The new routes after the update on the database (requests)
// ************************************************************************************************************************

router.post('/post_new_request', passport.authenticate('jwt', { session: false}), function(req, res) {
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

          let _id_request= new mongoose.mongo.ObjectId();
          Capability.updateOne(
            {"_id": req.body._id_capabilitate
            },
              {
                "$push": {"categories.$[outer].requests": {"$each":[{"_id": _id_request,
                                                               "body": req.body.new_request.body,
                                                               "hashtags": req.body.new_request.hashtags,
                                                               "authorName": req.body.new_request.authorName,
                                                               "comments": [],
                                                               "managerResponse": null}],
                                                            "$position": 0 }  
                                                              },
              },
              {
                "arrayFilters": [{ "outer._id":  mongoose.Types.ObjectId(req.body._id_categorie) }] ,
                "safe": true,
                "multi": true 
              },
            
            function(err, model) {
            console.log(err);
            res.status(200).send({success: true, message: "It worked!", received: req.body, _id_request: _id_request});

          }
            )

            Capability.findOne({
              "_id": req.body._id_capabilitate
            }, function(err, capability){
              if (err) throw err;
        
                if (!capability) {
                  return res.status(403).send({success: false, msg: 'Capability not found.'});
                } else {
                  User.findOne({
                    "_id": mongoose.Types.ObjectId(capability.adminId)
                  },function(err,managerUser){
                    if(err) throw err;
  
                    if(!managerUser){
                      return res.status(403).send({success: false, msg: 'Manager User not found.'});
                    }
                    else{
                      htmlBody= newRequestBody(req.body.new_request.authorName,req.body.new_request)
                      let mailOptions = {
                        from: 'metrosystems.budget.app@gmail.com', // sender address
                        to: managerUser.email, // list of receivers
                        subject: 'New request -Msys Budget App', // Subject line
                        text: 'New request ', // plain text body
                        html: htmlBody // html body
                    };
                
                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message sent: %s', info.messageId);
                        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                
                    });
                    }
                  })
                }
            });

        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

router.post('/post_comment', passport.authenticate('jwt', { session: false}), function(req, res) {
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
          let _id_comment= new mongoose.mongo.ObjectId();
          Capability.updateOne(
            {"_id": req.body._id_capabilitate,
              // "categories._id" : req.body._id_categorie
            },
              {

                "$addToSet": {"categories.$[categoryIndex].requests.$[requestIndex].comments": {"_id": _id_comment,
                                                                                  "name": req.body.newComment.name,
                                                                                  "body": req.body.newComment.body,
                                                                                  "managerResponse": null}}
              },
            { "arrayFilters": [{ "requestIndex._id":  mongoose.Types.ObjectId(req.body._id_request) },
                               { "categoryIndex._id": mongoose.Types.ObjectId(req.body._id_categorie)}] ,
              safe: true},
            function(err, model) {
            console.log(err);
            res.status(200).send({success: true, message: "It worked!", model: model,_id_comment: _id_comment});

          }
            )

          Capability.findOne({
            "_id": req.body._id_capabilitate
          }, function(err, capability){
            if (err) throw err;
      
              if (!capability) {
                return res.status(403).send({success: false, msg: 'Capability not found.'});
              } else {
                User.findOne({
                  "_id": mongoose.Types.ObjectId(capability.adminId)
                },function(err,managerUser){
                  if(err) throw err;

                  if(!managerUser){
                    return res.status(403).send({success: false, msg: 'Manager User not found.'});
                  }
                  else{
                    htmlBody= newCommentBody(user.full_name,req.body.newComment)
                    let mailOptions = {
                      from: 'metrosystems.budget.app@gmail.com', // sender address
                      to: managerUser.email, // list of receivers
                      subject: 'New comment -Msys Budget App', // Subject line
                      text: 'New comment ', // plain text body
                      html: htmlBody // html body
                  };
              
                  // send mail with defined transport object
                  transporter.sendMail(mailOptions, (error, info) => {
                      if (error) {
                          return console.log(error);
                      }
                      console.log('Message sent: %s', info.messageId);
                      // Preview only available when sending through an Ethereal account
                      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
              
                      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                  });
              // });
                  }
                })
              }
          });

            // res.status(200).send({success: true, message: "It worked!", _id_comment: _id_comment});

        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

router.post('/post_comment_management_response', passport.authenticate('jwt', { session: false}), function(req, res) {
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

          Capability.updateOne(
            {"_id": req.body._id_capabilitate
            },
              {
                "$set": {"categories.$[outer].requests.$[requestIndex].comments.$[inner].managerResponse": req.body.managerResponse},
              },
              {
                 "arrayFilters": [{ "requestIndex._id":  mongoose.Types.ObjectId(req.body._id_request) },
                                  { "outer._id":  mongoose.Types.ObjectId(req.body._id_categorie) },
                                  { "inner._id": mongoose.Types.ObjectId(req.body._id_comment) }
                ] ,
                "safe": true
              },
            
            function(err, model) {
            console.log(err);
          }
            )

          if(req.body.managerResponse.grantPermission){
            User.update(
              {"full_name": req.body.userName},
              {

              "$addToSet": {hasPermissionToAddExpense: req.body._id_categorie}
              },
              {safe: true, upsert: true},
              function(err, model) {
              console.log(err);
              }
          )
          }

          User.findOne({
            full_name: req.body.userName
          }, function(err, user) {
              if (err) throw err;
      
              if (!user) {
                return res.status(403).send({success: false, msg: 'User not found.'});
              } else {

                htmlBody= managerResponseBody(req.body.managerResponse.name,req.body.managerResponse.body)
                let mailOptions = {
                  from: 'metrosystems.budget.app@gmail.com', // sender address
                  to: user.email, // list of receivers
                  subject: 'Management Response -Msys Budget App', // Subject line
                  text: 'Management Response', // plain text body
                  html: htmlBody // html body
              };
          
              // send mail with defined transport object
              transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                      return console.log(error);
                  }
                  console.log('Message sent: %s', info.messageId);
                  // Preview only available when sending through an Ethereal account
                  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
          
                  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
              });
              }})


          
            res.status(200).send({success: true, message: "It worked!", received: req.body});

        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

router.post('/post_management_response_for_request', passport.authenticate('jwt', { session: false}), function(req, res) {
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

          Capability.updateOne(
            {"_id": req.body._id_capabilitate
            },
              {
                "$set": {"categories.$[outer].requests.$[requestIndex].managerResponse": req.body.managerResponse},
              },
              {
                 "arrayFilters": [{ "requestIndex._id":  mongoose.Types.ObjectId(req.body._id_request) },
                                  { "outer._id":  mongoose.Types.ObjectId(req.body._id_categorie) }
                ] ,
                "safe": true
              },
            
            function(err, model) {
            console.log(err);
          }
            )

          if(req.body.managerResponse.grantPermission){
            User.update(
              {"full_name": req.body.userName},
              {

              "$addToSet": {hasPermissionToAddExpense: req.body._id_categorie}
              },
              {safe: true, upsert: true},
              function(err, model) {
              console.log(err);
              }
          )
          }

          User.findOne({
            full_name: req.body.userName
          }, function(err, user) {
              if (err) throw err;
      
              if (!user) {
                // return res.status(403).send({success: false, msg: 'User not found.'});
              } else {

                htmlBody= managerRequestResponseBody(req.body.managerResponse.name,req.body.managerResponse.body)
                let mailOptions = {
                  from: 'metrosystems.budget.app@gmail.com', // sender address
                  to: user.email, // list of receivers
                  subject: 'Management Request Response -Msys Budget App', // Subject line
                  text: 'Management Request Response', // plain text body
                  html: htmlBody // html body
              };
          
              transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                      return console.log(error);
                  }
                  console.log('Message sent: %s', info.messageId);
                  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
              });
              }})


          
            res.status(200).send({success: true, message: "It worked!", received: req.body});

        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

router.post('/post_mark_request_as_read', passport.authenticate('jwt', { session: false}), function(req, res) {
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

          Capability.updateOne(
            {"_id": req.body._id_capabilitate
            },
              {
                "$set": {"categories.$[outer].requests.$[requestIndex].requestRead": true},
              },
              {
                 "arrayFilters": [ { "requestIndex._id":  mongoose.Types.ObjectId(req.body._id_request) },
                                   { "outer._id":  mongoose.Types.ObjectId(req.body._id_categorie) }] ,
                "safe": true
              },
            
            function(err, model) {
            console.log(err);
            res.status(200).send({success: true, message: "It worked!", model: model, body: req.body});

          }
            )
          
            // res.status(200).send({success: true, message: "It worked!"});

        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

router.post('/post_mark_comments_as_read', passport.authenticate('jwt', { session: false}), function(req, res) {
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

          Capability.updateOne(
            {"_id": req.body._id_capabilitate
            },
              {
                "$set": {"categories.$[outer].requests.$[requestIndex].comments.$[].messageRead": true},
              },
              {
                 "arrayFilters": [ { "requestIndex._id":  mongoose.Types.ObjectId(req.body._id_request) },
                                   { "outer._id":  mongoose.Types.ObjectId(req.body._id_categorie) }] ,
                "safe": true,
                "multi": true 
              },
            
            function(err, model) {
            console.log(err);
            res.status(200).send({success: true, message: "It worked!", model: model, body: req.body});

          }
            )
          
            // res.status(200).send({success: true, message: "It worked!"});

        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

router.post('/post_expense_as_user', passport.authenticate('jwt', { session: false}), function(req, res) {
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

              let _id_expense= new mongoose.mongo.ObjectId();

              Capability.update(
                {"_id": req.body._id_capabilitate
                ,
                "categories._id" : req.body._id_categorie
              },
                  {
                    "$addToSet": {"categories.$.list_of_expenses": { _id: _id_expense,
                                                        name: req.body.newExpense.name, 
                                                        description: req.body.newExpense.description, 
                                                        sum: req.body.newExpense.sum,
                                                        authorName: req.body.newExpense.authorName,
                                                        }}
                                                        ,
                    "$inc": {"categories.$.budget": -req.body.newExpense.sum}
                  },
                {safe: true, upsert: true},
                function(err, model) {
                console.log(err);
              })

                User.update(
                  {"_id": user._id},
                  {
                  "$pull": {hasPermissionToAddExpense: req.body._id_categorie}
                  },
                  {safe: true, upsert: true},
                  function(err, model) {
                  console.log(err);
                  }
              )
                res.status(200).send({success: true, message: "It worked!", _id_expense: _id_expense});
            }
          
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

router.post('/post_change_category_budget', passport.authenticate('jwt', { session: false}), function(req, res) {
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

          Capability.updateOne(
            {"_id": req.body._id_capabilitate
            },
              {
                "$set": {"categories.$[outer].budget": req.body.new_budget},
              },
              {
                 "arrayFilters": [{ "outer._id":  mongoose.Types.ObjectId(req.body._id_categorie) }] ,
                "safe": true,
                "multi": true 
              },
            
            function(err, model) {
            console.log(err);
          }
            )
          
            res.status(200).send({success: true, message: "It worked!", received: req.body});

        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});


getToken = function (headers) {
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(' ');
      if (parted.length === 2) {
        return parted[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

module.exports = router;