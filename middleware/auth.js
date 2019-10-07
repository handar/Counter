let jwt = require('jsonwebtoken');
const config = require('../config.js'); //secret

let checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers autoconverted to lowercase


  if (token) {
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }

    //check token
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        res.json({
          success: false,
          message: 'Token is not valid'
        });
        return res.render("login");
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.render("login");
  }
};

module.exports = {
  checkToken: checkToken
};
