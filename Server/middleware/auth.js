
// Authorization face
// Extract Token
// If Token is missing then retyrn respons

// Verifi Token


const User = require('../model/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = async (req, res, next) => {

    try {

        const token = req.cookies.token || req.body.token || req.header("Authorization").replace('Bearer ', "");
        
        if (!token) {
            return res.status(403).json(
                {
                    success : false,
                    massege : "Token is Missing",
                }
            );
        }


        try {
            
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;

        } catch (error) {
            console.log("Error While Verifing Token",error);
            res.status(404).json(
                {
                    success : false,
                    massege : 'Token is Invalid'
                }
            );
            
        }

        next();

        
    } catch (error) {
        return res.status(403).json(
            {
                success : false,
                massege : 'Something went wrong while Authentication'
            }
        );
    }
}



// Student Authorization 

exports.student = async (req, res, next) => {

    try {

        const plyload =  jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        const userAccount = plyload.accountType;

        if ( userAccount !== 'Student') {
            return res.status(403).json(
                {
                    success : false,
                    massege : 'You are not authorized to access this resource'
                }
            );
        }

        next();
        
    } catch (error) {
        
        console.log("Error While Verifing Student Token", error);
        res.status(404).json(
            {
                success : false,
                massege : 'Student Token is Invalid'
            }
        );

    }
}



// Professor Authorization 

exports.professor = async (req, res, next) => {

    try {

        const plyload =  jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        const userAccount = plyload.accountType;

        if ( userAccount !== 'professor') {
            return res.status(403).json(
                {
                    success : false,
                    massege : 'You are not authorized to access this resource'
                }
            );
        }
        
        next();

    } catch (error) {
        
        console.log("Error While Verifing professor Token", error);
        res.status(404).json(
            {
                success : false,
                massege : 'Processor Token is Invalid'
            }
        );
        
    }
}




// Admin Authorization

exports.admin = async (req, res, next) => {

    try {

        const plyload =  jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        const userAccount = plyload.accountType;

        console.log(userAccount);

        if ( userAccount !== 'Admin') {
            return res.status(403).json(
                {
                    success : false,
                    massege : 'You are not authorized to access this resource'
                }
            );
        }

        next();
        
    } catch (error) {
        
        console.log("Error While Verifing Admin Token", error);
        res.status(404).json(
            {
                success : false,
                massege : 'Admin Token is Invalid'
            }
        );
    }
}