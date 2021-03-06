import User from '../models/User.js'
import Role from '../models/Role.js'
import jwt from 'jsonwebtoken'
import config from '../config.js'

export const signUp = async (req, res) => {
    const { username, email, password, roles} = req.body

    //creating new user
    const newUser = new User({
        username: username,
        email: email,
        password: await User.encryptPassword(password),
    })

    //assigning roles to the users
    if(roles){
        const foundRoles = await Role.find({name: {$in: roles}})
        newUser.roles = foundRoles.map(role => role._id)
    }else{
        const role = await Role.findOne({name: "user"})
        newUser.roles = [role._id]
    }

    const userSaved = await newUser.save()
    console.log(userSaved)
    //signing the token with jwt
    const token = jwt.sign({id: userSaved.id},config.SECRET,{
        expiresIn: 86400 //24 hours
    })

    res.status(201).json({token})

}

export const signIn = async (req, res) => {

    const userFound = await User.findOne({email: req.body.email}).populate("roles")
    
    //if user doesnt exist
    if(!userFound) return res.status(400).json({message: "User not found"})

    const matchPassword = await User.comparePassword(req.body.password, userFound.password)

    //if password doesn't match
    if(!matchPassword) return res.status(401).json({token: null, message: 'Invalid password'})

    const token = jwt.sign({id: userFound._id}, config.SECRET,{
        expiresIn: 86400
    })

    res.json({token})
}