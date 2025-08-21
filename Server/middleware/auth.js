
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = async (req, res, next) => {

    try {

        const token = req.cookies.token || req.body.token || (req.header('Authorization') ? req.header('Authorization').replace('Bearer ', "") : null);
        
        if (!token) {
            return res.status(401).json(
                {
                    success : false,
                    massage : "Token is Missing",
                }
            );
        }


        try {
            
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
            next();

        } catch (error) {
            console.log("Error While Verifing Token",error);
            res.status(404).json(
                {
                    success : false,
                    massage : 'Token is Invalid'
                }
            );
            
        }
        
    } catch (error) {
        return res.status(403).json(
            {
                success : false,
                massage : 'Something went wrong while Authentication'
            }
        );
    }
}

// Role-Based Authorization Middleware

exports.roleBasedAuthorization = ( ...allowedRoles ) => {
    return ( req, res, next ) => {
        try {
            if ( !req.user || !allowedRoles.includes(req.user.accountType) ) {
                return res.status(403).json({
                    success : false,
                    massage : 'You are not authorized to access this resource'
                })
            }
            next();
        } catch (error) {
            console.error('Role Authorization Error:', err);
            return res.status(500).json({
                success: false,
                message: 'Role validation failed.',
            });
        }
    };
};


exports.professor = exports.roleBasedAuthorization('Professor');
exports.admin = exports.roleBasedAuthorization('Admin');
exports.student = exports.roleBasedAuthorization('Student');

// Student Authorization 

// exports.student = async (req, res, next) => {

//     try {

<<<<<<< HEAD
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
=======
//         const plyload =  jwt.verify(req.cookies.token, process.env.JWT_SECRET);
//         const userAccount = plyload.accountType;
>>>>>>> recovery-backup

//         if ( userAccount !== 'Student') {
//             return res.status(403).json(
//                 {
//                     success : false,
//                     massege : 'You are not authorized to access this resource'
//                 }
//             );
//         }

//         next();
        
//     } catch (error) {
        
//         console.log("Error While Verifing Student Token", error);
//         res.status(404).json(
//             {
//                 success : false,
//                 massege : 'Student Token is Invalid'
//             }
//         );

//     }
// }

// // Professor Authorization 

// exports.professor = async (req, res, next) => {

//     try {

//         const plyload =  jwt.verify(req.cookies.token, process.env.JWT_SECRET);
//         const userAccount = plyload.accountType;

<<<<<<< HEAD
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
=======
//         if ( userAccount !== 'professor') {
//             return res.status(403).json(
//                 {
//                     success : false,
//                     massege : 'You are not authorized to access this resource'
//                 }
//             );
//         }
>>>>>>> recovery-backup
        
//         next();

//     } catch (error) {
        
//         console.log("Error While Verifing professor Token", error);
//         res.status(404).json(
//             {
//                 success : false,
//                 massege : 'Processor Token is Invalid'
//             }
//         );
        
//     }
// }

// // Admin Authorization

// exports.admin = async (req, res, next) => {

//     try {

//         const plyload =  jwt.verify(req.cookies.token, process.env.JWT_SECRET);
//         const userAccount = plyload.accountType;

//         console.log(userAccount);

//         if ( userAccount !== 'Admin') {
//             return res.status(403).json(
//                 {
//                     success : false,
//                     massege : 'You are not authorized to access this resource'
//                 }
//             );
//         }

<<<<<<< HEAD
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
=======
//         next();
>>>>>>> recovery-backup
        
//     } catch (error) {
        
//         console.log("Error While Verifing Admin Token", error);
//         res.status(404).json(
//             {
//                 success : false,
//                 massege : 'Admin Token is Invalid'
//             }
//         );
//     }
// }