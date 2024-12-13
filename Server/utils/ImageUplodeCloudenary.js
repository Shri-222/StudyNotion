const cloudinary = require('cloudinary').v2

exports.uplodeImageToCloudinary = async ( file, folder, heigth, quality ) => {
    const options = { folder };

    if ( heigth ) {
        options.heigth = heigth;
    }

    if ( quality ) {
        options.quality = quality;
    }

    return await cloudinary.uploder.uplode(file.tempFilePath, options);
}