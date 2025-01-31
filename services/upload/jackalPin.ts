/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import axios from 'axios'
import { JACKAL_PIN_ENDPOINT_URL } from 'utils/constants'

export type UploadFileType = 'assets' | 'metadata' | 'cover' | 'thumbnail'

export const uploadToJackal = async (
  fileArray: File[],
  jackalPinSecretKey: string,
  fileType: UploadFileType,
): Promise<string> => {
  const data = new FormData()
  fileArray.forEach((file) => {
    data.append('file', file, `${fileType}/${file.name}`)
  })

  const res = await axios.post(JACKAL_PIN_ENDPOINT_URL, data, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jackalPinSecretKey}`,
    },
  })
  return res.data.IpfsHash
}
