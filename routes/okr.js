const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const validateLoginInput = require('../validation/login');
const OKR = require('../database/OKR');
const User = require('../database/User');


router.post('/add_okr', passport.authenticate('jwt', { session: false}), function(req, res) {
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
           // New OKR
            var newOKR= new OKR({
                    okr_name : req.body.okr_name,
                    okr_description : req.body.okr_description,
                    okr_price : req.body.okr_price,
                    okr_owner : req.body.okr_owner,
                    okr_comments: req.body.okr_comments
                });

            newOKR.save(function(err) {
                if (err) {
                console.log("Nu s-a reusit scrierea in baza de date")
                console.log(err)
                }
                else{
                console.log("Scriere in baza de date reusita")
                return res.status(200).send({success: true, msg: 'Added a new OKR !'});
            }
            });
          }
      });
    } else {
      return res.status(403).send({success: false, msg: 'No token provided.'});
    }
  });

router.get('/okr_list', passport.authenticate('jwt', { session: false}), function(req, res) {
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
            OKR.find({},function(err, okrs){
              if(err) console.log(err);
              if(!okrs){
                console.log("Nu s-au gasit okr-uri");
              }
              else{
                res.json({success:true, okrs});
              }
            })
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