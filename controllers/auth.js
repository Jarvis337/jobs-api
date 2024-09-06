const User = require('../models/User')
const bcrypt = require('bcryptjs')
const {BadRequestError, UnauthenticatedError} = require('../errors')
const {StatusCodes} = require('http-status-codes')


const register = async(req, res)=>{
  const user = await User.create({...req.body})
  const token = user.createJWT()
  res
  .status(StatusCodes.CREATED)
  .json({user:{name:user.name}, token})
}

const login = async(req, res)=>{
  const {email, password} = req.body
  if(!email || !password){
    throw new BadRequestError('pls provide email and pass')
  }
  const user = await User.findOne({email})
//compare password
if(!user){
  throw new UnauthenticatedError('Invalid credentials')
} 
const isPasswordCorrect = await user.comparePassword(password)
if(!isPasswordCorrect){
  throw new UnauthenticatedError('Invalid credentials')
}
const token = user.createJWT();
res.status(StatusCodes.OK).json({user:{name:user.name}, token})
}
module.exports = {register, login}