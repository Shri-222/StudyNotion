// feach data 
// validation
// save into DB
// return respons

const Categary = require('../../model/Categary');

exports.createCategary = async (req, res) => {

    try {

        const { name, Description } =  req.body;

        if ( !name || !Description ) {
            return res.status(404).json(
                {
                    success : false,
                    message : 'Name and Description are required.'
                }
            );
        } 
        
        const newTags = await Categary.create(
            {
                name : name,
                discription : Description,
            }
        );

        console.log(newTags);


        res.status(200).json(
            {
                success : true,
                message : 'Tag Created Successfully.',
                newTags,
            }
        );
            

    } catch (error) {
       
    }
}

// fetch All tags

exports.getAllCategary = async (req, res) => {

    try {

        const allTags = await Categary.find({}, {name : true, Discription : true});

        // console.log(allTags);


        res.status(200).json(
            {
                success : true,
                message : 'All Tags.',
                allTags,
            }
        );
        
    } catch (error) {
        console.log('Error While Fetching All Tag');
        return res.status(500).json({
            success : false,
            message : 'Error While Fetching All Tag, Please try again Later.',
        });
    }
}


// Catagary page 

exports.categaryPage = async (req, res) => {

    try {

        // fetch catagary Id 
            const catagaryId = req.body;

        // find the data or courses by category id
            const catagaryDetails = await Categary.findById(catagaryId).populate('courses').exec();
            console.log(catagaryDetails);

        // validate the data
            if( !catagaryDetails ) {
                return res.status(404).json(
                    {
                        success : false,
                        message : 'No Result found.',
                    }
                );
            }

        // fetch data of other catagarys
            const extraCourse = await Categary.find({ _id : { $ne : catagaryId } }).populate('courses').exec();

        // fetch most selling courses
        // const mostSellingCourses = await Course.find({ catagories : catagaryId }).sort({ sold : 'descending' }).limit(3).exec();            

        // return respons

            res.status(200).json(
                {
                    success : true,
                    message : 'Categary Page Data.',
                    data : {
                        catagaryDetails,
                        extraCourse,
                        // mostSellingCourses,
                    }
                }
            );
        
    } catch (error) {
        console.log('Error While Fetching Data', error);
        return res.status(500).json({
            success : false,
            message : 'Error While Fetching Data, Please try again Later.',
        });
    }
}