const util = require('util')
const gc = require('./gcp')
const bucket = gc.bucket(process.env.GOOGLE_BUCKET_NAME) // our bucket name

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */

const uploadDoc = (file, userid) => new Promise((resolve, reject) => {
  console.log('ENTERED GCP-HELPERS')
  const { originalname, buffer } = file

  const blob = bucket.file(originalname.replace(/.*(?=\.)/g, userid))
  console.log(`The blob is ${blob}`)
  const blobStream = blob.createWriteStream({
    resumable: false
  })
  console.log(`This is the ${JSON.stringify(blobStream)}`)
  blobStream.on('finish', () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    console.log(`This is the publicUrl: ${publicUrl}`)
    resolve(publicUrl)
  })
  .on('error', (err) => {
    console.log(err)
    reject(`Unable to upload image, something went wrong`)
  })
  .end(buffer)
})

module.exports = uploadDoc