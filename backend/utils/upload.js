const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname) || '.jpg');
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/i.test(path.extname(file.originalname));
  if (allowed) cb(null, true);
  else cb(new Error('Only image files allowed'), false);
};

exports.uploadSingle = multer({ storage, fileFilter }).single('photo');
exports.uploadMultiple = multer({ storage, fileFilter }).array('images', 10);
