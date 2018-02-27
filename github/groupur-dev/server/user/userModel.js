const mongoose = require('mongoose');
const Schema = mongoose.Schema;

console.log('HITTING THE USERMODEL ON POST')
const userSchema = new Schema ({
    username: {type: String, unique: true, required: true},
    password: { type: String, required: true},
    firstName: {type: String, required: false},
    lastName: {type: String, required: false},
    // groups: {type: Array, required:false}
    // groups: [{group_id: Number, group_name: String, amount: Number}]
    // firstName: {type: String, required: false},
    // lastName: {type: String, required: false},
    // groups: {type: Array, required:false}
    groups: [{group_id: Number, group_name: String, amount: Number}]
});

const SALT_WORK_FACTOR = 10;
const bcrypt = require('bcryptjs');

//Encrypt the password with bcrypt before saving
userSchema.pre('save', function(next) {
  this.password = bcrypt.hashSync(this.password, SALT_WORK_FACTOR);
  next();
});

userSchema.statics.checkPassword = function(user, cb) {
    let {username, password} = user;
    this.findOne({username: username}, (err, doc) => {
        if(err) res.send(500, err);
        if(!doc) return cb(doc, false);
        if (doc) return cb(doc, bcrypt.compareSync(password, doc.password));
    })
}



const User = mongoose.model('User', userSchema);

module.exports = User;
