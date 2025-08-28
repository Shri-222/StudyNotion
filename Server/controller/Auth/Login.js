
const User = require('../../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cookie = require('cookie-parser');

exports.login = async (req, res) => {
    
    try {
        
            const {email, password} = req.body;

            if (!email || !password) {
                return res.status(400).json (
                    {
                        success : false,
                        massage : 'Please enter all the required fields'
                    }
                )
            }

            const user = await User.findOne({email}).select('+password');

            if (!user) {
                return res.status(401).json(
                    {
                        success : false,
                        massage : 'Invalid email or password.',
                    }
                );
            }

            console.log('This is a new user ID :-', user._id);


            console.log(" JWT Secret :- ", process.env.JWT_SECRET);

            if (await bcrypt.compare(password, user.password)) {

                const payload = {
                    email : user.email,
                    Id : user._id,
                    accountType : user.accountType, 
                }

                const token = jwt.sign(payload, process.env.JWT_SECRET || 'BARSERK', {
                        expiresIn : '24h',

                });

                user.Token = token;
                user.password = undefined;

                const option = {
                    httpOnly : true,
                    secure : process.env.NODE_ENV === 'production' ? true : false,
                    sameSite : 'strict',
                    maxAge : 3 * 24 * 60 * 60 * 1000 // 3 days 
                }

                res.cookie('token', token, option).status(200).json(
                    {
                        success : true,
                        message : 'User Logged In successfully',
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

    
