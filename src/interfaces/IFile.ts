export interface IFile {
  encoding: string;
  buffer: Buffer;
  filename: string;
  path: string;
  mimetype: string;
  originalname: string;
  destination: string;
  size: number;
  key: string;
  bucket: string;
  storageClass: string;
  etag: string;
  location: string;
}
