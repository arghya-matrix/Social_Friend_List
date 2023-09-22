const userServices = require("../services/user.services");
const sessionServices = require("../services/sessions.services");
const generateNumber = require('../services/generateRandomNumber');
const jwtServices = require('../services/jwt.services')

async function signUp(req,res){
    try {
        const stringWithSpaces = req.body.Name.toLowerCase();
        const userName = stringWithSpaces.replace(/\s/g, "");
        const number = generateNumber();
    
        const user = await userServices.createUser({
            email_address: req.body.email_address,
            Name: req.body.Name,
            password: req.body.password,
            user_name: userName.concat(number)
        })
        res.status(200).json({
            message : `${req.body.email_address} created`,
            data: user
        })
    } catch (error) {
        console.log(error, "<--- Error creating user");
        res.status(500).json({
            message : `Internal error`
        })
    }
}

async function signIn(req, res) {
  try {
    const data = req.body;
    const user = await userServices.signIn({
      email_address: data.email_address,
    });
    const dbUser = user.rows[0];
    // console.log(dbUser);
    // console.log(data);

    if (dbUser == undefined) {
      res.json({
        message: `!!!!You are not Signed Up!!!!`,
      });
    } else if (
      data.email_address == dbUser.email_address &&
      data.password == dbUser.password
    ) {
      const sessions = await sessionServices.createSession({
        user_id: dbUser.user_id,
      });

      const jwt = jwtServices.createToken({
        sessions_id: sessions.id,
        user_id: dbUser.user_id,
        email_address: dbUser.email_address,
        user_name: dbUser.user_name,
        type: dbUser.user_type,
      });

      // console.log(jwt, "<---- Created jwt token");

      const authData = jwtServices.verifyToken(jwt);

      // console.log(authData, "<---- Auth data");
      const expDate = new Date(authData.exp * 1000);
      const iatDate = new Date(authData.iat * 1000);

      await sessionServices.updateSession({
        expiry_date: expDate,
        login_date: iatDate,
        sessions_id: authData.sessions_id,
      });

      const userdata = user.rows[0];
      delete userdata.password;
      delete userdata.user_id;
      res.json({
        message: "Logged In",
        Profile: userdata,
        JWTtoken: jwt,
      });
    } else {
      res.json({
        message: "Invalid Combination",
      });
    }
  } catch (error) {
    console.log(error, "<-----Error???>>>>>");
    res.status(500).json({
      message: `Server Error`,
      err: error,
    });
  }
}

async function logOut(req, res) {
  try {
    const jwt = req.headers["authorization"];
    const authData = jwtServices.verifyToken(jwt);
    const sessions_id = authData.sessions_id;
    const date = new Date();
    const logOut = await sessionServices.logoutSession({
      date: date,
      sessions_id: sessions_id,
    });
    if (logOut.numUpdatedRows > 0) {
      res.json({
        message: `${authData.user_name} Logged out`,
      });
    } else {
      res.json({
        message: `Log in to log out`,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: `Kuch toh gadbad haiiiii !!!!!`,
      err: error,
    });
  }
}

module.exports = {
  signIn,
  logOut,
  signUp
};
