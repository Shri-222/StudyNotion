
// 1 - create the section 

// i - fetch data from req body 
// ii - validation
// iii - create entry in db
// iv - update or pass the section id in course and poppulate the section and sub-sections
// v - return response 


const Course = require('../../model/Course');
const Section = require('../../model/Section');
// const subSection = require('../Courses/subSection');


exports.createSection = async (req, res) => {

    try {
        
        const {sectionName, courseID} = req.body;

        if (!sectionName ||!courseID) {
            return res.status(400).json({
                success : false,
                message : 'Please Provide All Required Fields.',
            });
        }


        const newSection = await Section.create({sectionName});

        const updatedCourse = await Course.findByIdAndUpdate( 
                                                             { courseID },
                                                             {
                                                                $push : 
                                                                    {
                                                                        Section : newSection._id
                                                                    }
                                                             },
                                                             {
                                                                new : true
                                                             }
                                                            ).populate(
                                                                        {
                                                                            path : 'section',
                                                                            populate :
                                                                                {
                                                                                    path :'subSection', 
                                                                                }
                                                                        }
                                                                       ).exec();

        res.status(200).json(
            {
                success : true,
                message : 'Section Created Successfully.',
                updatedCourse,
            }
        );
  
    } catch (error) {
        
        console.log('Error While Creating Section', error);
        return res.status(500).json({
            success : false,
            message : 'Error While Creating Section, Please try again Later.',
        });
    }
}


// 2 - Update Section 

// i - fetch data from req body
// ii - validation 
// iii - update the section name
// iv - return respons


exports.updateSection = async (req, res) => {

    try {

        const { sectionName, sectionID} = req.body;

        if ( !sectionName || !sectionID ) {

            return res.status(400).json({
                success : false,
                message : 'Please Provide All Required Fields.',
            });
        }


        const updatedSection = await Section.findByIdAndUpdate({ sectionID }, { sectionName }, { new : true });

        res.status(200).json(
            {
                success : true,
                message : 'Section Updated Successfully.',
                updatedSection,
            }
        );  
        
    } catch (error) {

        
    }
}



// 3 - Delete a section

// i - fetch data from req body
// ii - delete section
// iii - send response 

exports.deleteSection = async (req, res) => {

    try {

        const { sectionID } = req.body;
        
        const deletedSection = await Section.findByIdAndDelete({ sectionID });

        res.status(200).json(
            {
                success : true,
                message : 'Section Deleted Successfully.',
            }
        );
        
    } catch (error) {

        console.log('Error While Deleting a Section', error);
        return res.status(500).json({
            success : false,
            message : 'Error While Deliting a Section, Please try again Later.',
        });
    }
}