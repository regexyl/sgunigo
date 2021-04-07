const Cloud = require('@google-cloud/storage')
const path = require('path')
const serviceKey = path.join(__dirname, './sgunigo-gcp-keys.json')

console.log('ENTERED GCP')

const { Storage } = Cloud
const storage = new Storage({
  keyFilename: serviceKey,
  projectId: 'sgunigo-storage',
})

module.exports = storage