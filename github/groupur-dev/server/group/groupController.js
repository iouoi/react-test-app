const mongoose = require('mongoose');
const { Group } = require('./groupModel');

const groupController = {

  addMember: function(req, res) {
    let newUser = {
      username: req.body.username,
      amount: req.body.amount
    }

    Group.findOneAndUpdate({group_id: req.body.group_id}, { $push: { members: newUser }}, {new: true}, (err, group) => {
      if (err) return res.sendStatus(400);
    })
  },

  removeMember: function(req, res) {
    Group.findOneAndUpdate({group_id: req.body.group_id}, { $pull: { members: req.body._id }}, {new: true}, (err, group) => {
      if (err) return res.sendStatus(400);
    })
  },

  addOrder: function(req, res) {
    Group.findOneAndUpdate({group_id: req.body.group_id}, { $inc: { min_amt: -1} }, {new: true}, (err, group) => {
      if (err) return res.sendStatus(400);
    })
  },

  removeOrder: function(req, res) {
    Group.findOneAndUpdate({group_id: req.body.group_id},  { $inc: { min_amt: +1 } }, {new: true}, (err, group) => {
      if (err) return res.sendStatus(400);
    })
  }
}

module.exports = groupController;
