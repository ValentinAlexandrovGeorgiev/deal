let User = require('../models/user')
const uuid = require('shortid')

class Auth {
  constructor() {

  }

  login(req, res) {

    const {
      email,
      password
    } = req.body

    User.findOne({
      email
    }, (err, user) => {
      if (!!user) {
        if(user.comparePassword(password) === true) {
          return res.status(200).send({
            success: true,
            user: user
          })
        } else {

          return res.status(401).send({
            message: 'Please check your creadentials again!'
          })
        }
      } else {

        return res.status(401).send({
          message: 'Please check your creadentials again!'
        })
      }
    })

  }

  signup(req, res) {

    const {
      email,
      name,
      familyName,
      password
    } = req.body

    User.findOne({
      email
    }, (err, user) => {
      if (!user) {
        const newUser = new User({
          email: email,
          firstName: name,
          lastName: familyName,
          password: password,
          favID: uuid.generate()
        })

        newUser.save((err, _user) => {
          if (!!err) {
            return res.status(500).send({
              message: err.message
            })
          }
          return res.status(201).send({
            success_message: 'Congratulations!'
          })
        })
      } else if(!err) {
        return res.status(401).send({
          message: 'There is a user with this creadentials!'
        })
      } else {
        return res.status(500).send({
          massage: err.message
        })
      }
    })

  }

  logout() {

  }
}


module.exports = new Auth()
