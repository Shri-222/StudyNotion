const cloudinary = require('cloudinary').v2;

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
  try {
    const options = { folder };

    if (height || quality) {
      options.transformation = [];
      if (height) {
        options.transformation.push({ height, crop: 'scale' });
      }
      if (quality) {
        options.transformation.push({ quality });
      }
    }

    // Upload the image
    const result = await cloudinary.uploader.upload(file.tempFilePath, options);
    return result;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};
