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
  if (fileType === 'cover' || fileType === 'thumbnail') {
    const data = new FormData()
    fileArray.forEach((file) => {
      data.append('files', file)
    })
    const res = await axios.post(`${JACKAL_PIN_ENDPOINT_URL}/v1/files`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jackalPinSecretKey}`,
      },
    })

    if (res.status !== 200) {
      throw 'could not upload file to Jackal Pin'
    }

    return res.data[0].cid
  }

  const res = await axios.post(`${JACKAL_PIN_ENDPOINT_URL}/collections/${fileType}`, null, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jackalPinSecretKey}`,
    },
  })

  if (res.status !== 200) {
    throw 'could not upload files to Jackal Pin'
  }
  const collectionId: number = res.data.id
  const data = new FormData()
  fileArray.forEach((file) => {
    data.append('files', file)
  })

  const resTwo = await axios.post(`${JACKAL_PIN_ENDPOINT_URL}/v1/files`, data, {
    headers: {
      Authorization: `Bearer ${jackalPinSecretKey}`,
    },
  })

  if (resTwo.status !== 200) {
    throw 'could not upload files to Jackal Pin'
  }

  const resData = resTwo.data
  const ps = []
  for (const fileDetail of resData) {
    const id: number = fileDetail.id

    const p = axios.put(`${JACKAL_PIN_ENDPOINT_URL}/collections/${collectionId}/${id}`, null, {
      headers: {
        Authorization: `Bearer ${jackalPinSecretKey}`,
      },
    })
    ps.push(p)
  }

  await Promise.all(ps)

  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(resolve, 30000))

  const finalRes = await axios.get(`${JACKAL_PIN_ENDPOINT_URL}/collections/${collectionId}`, {
    headers: {
      Authorization: `Bearer ${jackalPinSecretKey}`,
    },
  })

  return finalRes.data.cid
}
