const CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

const UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export interface CloudinaryUploadResponse {
  secure_url: string
  public_id: string
  original_filename: string
  resource_type: string
}

export const uploadPdfToCloudinary = async (
  file: File,
): Promise<CloudinaryUploadResponse> => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      'Faltan variables de entorno de Cloudinary',
    )
  }

  const formData = new FormData()

  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  console.log(CLOUD_NAME)
    console.log(UPLOAD_PRESET)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    {
      method: 'POST',
      body: formData,
    },
  )

  const result = await response.json()

  if (!response.ok) {
    console.error('Cloudinary error:', result)

    throw new Error(
      result.error?.message ??
        'Error subiendo PDF a Cloudinary',
    )
  }

  return result
}