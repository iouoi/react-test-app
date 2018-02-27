const cookieController = {};

cookieController.setSSIDCookie = setSSIDCookie;


function setSSIDCookie(req, res, next) {
   res.cookie('ssid', res.locals.user._id, {httpOnly: true, maxAge: 120000});
  //  console.log(res.cookies);
   next();
}

module.exports = cookieController;