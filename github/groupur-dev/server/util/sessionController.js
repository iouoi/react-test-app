const Session = require('./sessionModel');

const sessionController = {};

sessionController.verifySession = (req, res) => {
  Session.findOne({cookieId: req.cookies.ssid}, (err, result) => {
    if(err || !result){
      return res.send({
        status: false
      });
    }
    res.send({
      status: true
    });
  });
};

sessionController.startSession = (req, res, next) => {
  Session.create({cookieId: res.locals.user._id}, (err, createdSession) => {
    if(err) console.log(err);
    if(createdSession) {
      console.log('session created successfully')
      // console.log('hi', res['set-cookie']);
      console.log('\n\nRES', res);
      return res.send({activeSession: true});
    }
    else res.status(500).send('Username already in use'); //Need to handle when username already exists
  });
};

module.exports = sessionController;