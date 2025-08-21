
const Course = require('../../model/Course');
const Section = require('../../model/Section');
const mongoose = require('mongoose');
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

        const course = await Course.findById(courseID);

        if (!course) {
        return res.status(404).json({
            success: false,
            message: 'Course not found.',
        });
        }

        const newSection = await Section.create({sectionName});

        const updatedCourse = await Course.findByIdAndUpdate( 
                                                              courseID ,
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

        res.status(201).json(
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

exports.updateSection = async (req, res) => {

    try {

        const { sectionName, sectionID} = req.body;

        if ( !sectionName || !sectionID ) {

            return res.status(400).json({
                success : false,
                message : 'Please Provide All Required Fields.',
            });
        }


        const updatedSection = await Section.findByIdAndUpdate(sectionID , { sectionName }, { new : true });

        if (!updatedSection) {
            return res.status(404).json({
                success: false,
                message: 'Section not found.',
        });
    }

        res.status(200).json(
            {
                success : true,
                message : 'Section Updated Successfully.',
                updatedSection,
            }
        );  
        
    } catch (error) {
         console.error('Error updating section:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating section. Please try again later.',
            error: error.message,
        });
        
    }
}


// 3 - Delete a section


exports.deleteSection = async (req, res) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const { sectionID , courseID } = req.body;

         if (!sectionID || !courseID) {
            return res.status(400).json({
                success: false,
                message: 'Please provide sectionID and courseID.',
            });
        }
        
        await Section.findByIdAndDelete(courseID, { $pull : { section : sectionID } } , { session });

        const deletedSection = await Section.findByIdAndDelete(sectionID, { session });

        if (!deletedSection) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: 'Section not found.',
            });
        }

         await session.commitTransaction();

        res.status(200).json(
            {
                success : true,
                message : 'Section Deleted Successfully.',
            }
        );
        
    } catch (error) {
        await session.abortTransaction();

        console.log('Error While Deleting a Section', error);
        return res.status(500).json({
            success : false,
            message : 'Error While Deliting a Section, Please try again Later.',
        });
    } finally {
        session.endSession();
  }
}