import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadImage = async (
  file: string,
  options: {
    folder?: string
    public_id?: string
    transformation?: any[]
  } = {}
) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: options.folder || 'portfolio',
      public_id: options.public_id,
      transformation: options.transformation,
      resource_type: 'auto',
    })

    return {
      publicId: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw new Error('Failed to upload image')
  }
}

export const deleteImage = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    throw new Error('Failed to delete image')
  }
}

export const generateImageUrl = (
  publicId: string,
  transformations: any[] = []
) => {
  return cloudinary.url(publicId, {
    transformation: transformations,
    secure: true,
  })
}

// Predefined transformations
export const imageTransformations = {
  thumbnail: [
    { width: 300, height: 300, crop: 'fill', quality: 'auto', format: 'auto' }
  ],
  medium: [
    { width: 800, height: 600, crop: 'fill', quality: 'auto', format: 'auto' }
  ],
  large: [
    { width: 1200, height: 800, crop: 'fill', quality: 'auto', format: 'auto' }
  ],
  hero: [
    { width: 1920, height: 1080, crop: 'fill', quality: 'auto', format: 'auto' }
  ]
}

export default cloudinary
