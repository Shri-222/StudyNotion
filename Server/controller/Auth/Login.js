//fetch the data from request body
// validation 
// check if user is not signed in
// check password or compair password
// Genarate JWT Token
// Genarate Cookies
// return response

const User = require('../../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cookie = require('cookie-parser');

exports.login = async (req, res) => {
    
    try {
        
            const {email, password} = req.body;

            if (!email || !password) {
                return res.status(403).json (
                    {
                        success : false,
                        massege : 'Please enter all the required fields'
                    }
                )
            }

            const user = await User.findOne({email});

            console.log('This is a new user ID :-', user._id);

            if (!user) {
                return res.status(404).json(
                    {
                        success : false,
                        massege : 'User is Not Registrered, Please Sign in First!',
                    }
                );
            }

            console.log(" JWT Secret :- ", process.env.JET_SECRET);

            if (await bcrypt.compare(password, user.password)) {

                const plyload = {
                    email : user.email,
                    Id : user._id,
                    accountType : user.accountType, 
                }
                const token = jwt.sign(plyload, process.env.JET_SECRET || 'BARSERK', {
                        expiresIn : '5h',

                });

                user.Token = token;
                user.password = undefined;

                const option = {
                    expires : new Date(Date.now() + 3*24*60*60*1000),
                    httpOnly : true,
                }

                res.cookie('token', token, option).status(200).json(
                    {
                        success : true,
                        massege : 'User Logged In successfully',
                        Token : token,
                        Data : user,
                    }
                );
            }

            else {
                res.status(401).json(
                    {
                        success : false,
                        massege : 'Password is Incorrect, Please Enter Password Correctly',
                    }
                )
            }


        } catch (error) {

            console.log('Error While login', error);
            return res.status(500).json(
                {
                    success : false,
                    massege : 'Login Failuer, Please try again Later',
                }
            )
        
    }
}

    
