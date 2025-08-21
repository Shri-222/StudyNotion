 
// 1 - Cerate the sub-Section

const Section = require('../../model/Section');
const subSection = require('../../model/SubSection');
const {uplodeImageToCloudinary} = require('../../utils/ImageUplodeCloudenary');
require('dotenv').config();

exports.createsubSection = async (req, res) => {

    try {

        const { sectionID, title, TimeDuration, description } = req.body;

        const videoFile = req.files.videoFile;

        if (!sectionID ||!title ||!TimeDuration ||!description ||!videoFile) {
            return res.status(400).json(
                {
                    success : false,
                    message : 'All Data Are Required'
                }
            );
        }

         // Check if section exists
        const section = await Section.findById(sectionID);
        if (!section) {
            return res.status(404).json({
                success: false,
                message: 'Parent section not found.',
            });
        }

        const videoUplode = await uplodeImageToCloudinary(videoFile, process.env.VIDEO_UPLOAD_FOLDER);

        const newSubSection = await subSection.create( {
            Title : title,
            TimeDuration : TimeDuration,
            Description : description,
            VideoUrl : videoUplode.secure_url
        });

        const updatedSection = await Section.findByIdAndUpdate(
                                                                sectionID ,
                                                                {
                                                                    $push : {
                                                                        subSection : newSubSection._id
                                                                    }
                                                                },
                                                                { new : true }
                                                              ).populate('subSections').exec();

        res.status(201).json(
            {
                success : true,
                message : 'Sub-Section Created Successfully',
                updatedSection
            }
        );

    } catch (error) {
        
        console.log('Error While Creating Sub-Section', error);
        return res.status(500).json({
            success : false,
            message : 'Error While Creating Sub-Section, Please try again Later',
        });
    }
}


// 2 - Update sub-Section

exports.updateSubSection = async (req, res) => {

    try {

        const { subSectionID, title, TimeDuration, description} = req.body;

        const videoFile = req.files.videoFile;

        if (!subSectionID) {
            return res.status(400).json({
                success: false,
                message: 'subSectionID is required.',
            });
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (TimeDuration) updateData.timeDuration = TimeDuration;
        if (description) updateData.description = description;

        if (videoFile) {
            const videoUpload = await uplodeImageToCloudinary(videoFile, process.env.VIDEO_UPLOAD_FOLDER);
            updateData.videoUrl = videoUpload.secure_url;
        }

        const updatedSubSection = await subSection.findByIdAndUpdate(
                                                                     subSectionID ,
                                                                    updateData,
                                                                    { new : true }
                                                              ).exec();

        if (!updatedSubSection) {
            return res.status(404).json({
                success: false,
                message: 'Sub-section not found.',
            });
        }
                    
        res.status(200).json(
            {
                success : true,
                message : 'Sub-Section Updated Successfully',
                updatedSubSection
            }
        );
        
    } catch (error) {
        
        console.log('Error While Updating Sub-Section', error);
        return res.status(500).json({
            success : false,
            message : 'Error While Updating Sub-Section, Please try again Later',
        });
    }
}


// 3 - Delete sub-Section

exports.deleteSubSection = async (req, res) => {

    try {

        const { subSectionID, sectionID  } = req.body;

        if (!subSectionID || !sectionID) {
            return res.status(400).json({
                success: false,
                message: 'subSectionID and sectionID are required.',
            });
        }

        await Section.findByIdAndUpdate(sectionID, {$pull : {subSection : subSectionID}} );

        const deletedSubSection = await subSection.findByIdAndDelete(subSectionID);

        if (!deletedSubSection) {
            return res.status(404).json({
                success: false,
                message: 'Sub-section not found.',
            });
        }

        res.status(200).json(
            {
                success : true,
                message : 'Sub-Section Deleted Successfully',
            }
        );
        
    } catch (error) {
      
        console.log('Error While deleting Sub-Section', error);
        return res.status(500).json({
            success : false,
            message : 'Error While deleting Sub-Section, Please try again Later',
        });  
    }
}