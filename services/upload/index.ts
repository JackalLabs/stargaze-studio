import { uploadToFleek } from './fleek'
import { uploadToJackal } from './jackalPin'
import type { UploadFileType } from './pinata'
import { uploadToPinata } from './pinata'
import { uploadToWeb3Storage } from './web3-storage'

export type UploadServiceType = 'pinata' | 'web3-storage' | 'fleek' | 'jackalPin'

export const upload = async (
  fileArray: File[],
  uploadService: UploadServiceType,
  fileType: UploadFileType,
  pinataApiKey: string,
  pinataSecretKey: string,
  web3StorageEmail: string,
  web3StorageSpaceName: string,
  fleekClientId: string,
  fleekDirectoryName: string,
  jackalPinApiKey: string,
): Promise<string> => {
  if (uploadService === 'web3-storage') return uploadToWeb3Storage(fileArray, web3StorageEmail, web3StorageSpaceName)
  else if (uploadService === 'pinata') return uploadToPinata(fileArray, pinataApiKey, pinataSecretKey, fileType)
  else if (uploadService === 'fleek') return uploadToFleek(fileArray, fleekClientId, fleekDirectoryName)
  else if (uploadService === 'jackalPin') return uploadToJackal(fileArray, jackalPinApiKey, fileType)
  throw new Error('Invalid upload service')
}
