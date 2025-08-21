

const Categary = require('../../model/Categary');

exports.createCategary = async (req, res) => {

    try {

        const { name, description } =  req.body;

        if ( !name || !description ) {
            return res.status(400).json(
                {
                    success : false,
                    message : 'Name and Description are required.'
                }
            );
        } 
        
        const newCategory = await Categary.create(
            {
                name : name,
<<<<<<< HEAD
                discription : Description,
=======
                description
>>>>>>> recovery-backup
            }
        );

        console.log(newCategory);


        res.status(200).json(
            {
                success : true,
                message: 'Category created successfully.',
                category: newCategory,
            }
        );
            

    } catch (error) {
            console.error('Error while creating category:', error);
            res.status(500).json({
            success: false,
            message: 'Server error while creating category.',
        });
    }
}

// fetch All tags

exports.getAllCategary = async (req, res) => {

    try {

        const allCategories  = await Categary.find({}, {name : 1, Discription : 1});

        // console.log(allTags);


        res.status(200).json(
            {
                success : true,
                message : 'All Tags.',
                allCategories : allCategories,
            }
        );
        
    } catch (error) {
        console.log('Error While Fetching All Categories');
        return res.status(500).json({
            success : false,
            message : 'Error While Fetching All Categories, Please try again Later.',
        });
    }
}


// Catagary page 

exports.categaryPage = async (req, res) => {

    try {

        // fetch catagary Id 
            const { catagaryId } = req.body;

            if (!catagaryId) {
                return res.status(400).json({
                    success: false,
                    message: 'Category ID is required.',
            });
    }

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