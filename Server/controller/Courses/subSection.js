 
// 1 - Cerate the sub-Section

// i - fetch data from req body
// ii - extract video/file
// iii - validetion
// iv - uplode the video in cloudinry and get Secure_url
// v - create entry in DB and push sub-section_ID in section
// vi - return response

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

        const videoUplode = await uplodeImageToCloudinary(videoFile, process.env.VIDEO_UPLOAD_FOLDER);

        const newSubSection = await subSection.create( {
            Title : title,
            TimeDuration : TimeDuration,
            Description : description,
            VideoUrl : videoUplode.secure_url
        });

        const updatedSection = await Section.findByIdAndUpdate(
                                                                { sectionID },
                                                                {
                                                                    $push : {
                                                                        subSection : newSubSection._id
                                                                    }
                                                                },
                                                                { new : true }
                                                              ).populate().exec();

        res.status(201).json(
            {
                success : true,
                message : 'Sub-Section Created Successfully',
                newSubSection
            }
        );

        // console.log(updatedSection);
        
    } catch (error) {
        
        console.log('Error While Creating Sub-Section', error);
        return res.status(500).json({
            success : false,
            message : 'Error While Creating Sub-Section, Please try again Later',
        });
    }
}



// 2 - Update sub-Section

// fetch data from req Body
// validation not needed
// update sub-Section
// return response

exports.updateSubSection = async (req, res) => {

    try {

        const { subSectionID, title, TimeDuration, description} = req.body;

        const videoFile = req.files.videoFile;

         const videoUplode = await uplodeImageToCloudinary(videoFile, process.env.VIDEO_UPLOAD_FOLDER);

        const updatedSubSection = await subSection.findByIdAndUpdate(
                                                                    { _id : subSectionID },
                                                                    {
                                                                        Title : title,
                                                                        TimeDuration : TimeDuration,
                                                                        Description : description,
                                                                        VideoUrl : videoUplode.secure_url
                                                                    },
                                                                    { new : true }
                                                              ).exec();
                    
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

// fetch data from req Body
// Delete sub-Section
// return response


exports.deleteSubSection = async (req, res) => {

    try {

        const { subSectionID } = req.body;

        const deleteSubSection = await subSection.findByIdAndDelete(subSectionID);

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