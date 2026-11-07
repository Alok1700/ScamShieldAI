const multer = require('multer');
const config = require('../config');

// Safe memory storage to prevent untrusted files from touching disk
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: config.maxUploadSizeBytes
  },
  fileFilter: (req, file, cb) => {
    if (config.allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Only PNG, JPG, JPEG, and WebP are allowed.'));
    }
  }
});

module.exports = upload;
