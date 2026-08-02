const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const datasetController = require('../controllers/datasetController');
const tierLimit = require('../middleware/tierLimit');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (['.csv', '.xlsx', '.xls'].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .csv, .xlsx, and .xls files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

router.use(auth);

router.get('/', datasetController.getDatasets);
router.post('/upload', tierLimit, upload.single('file'), datasetController.uploadDataset);
router.get('/:id', datasetController.getDatasetReport);
router.get('/:id/data', datasetController.getDatasetData);
router.patch('/:id/columns/:columnId', datasetController.updateColumn);
router.post('/:id/clean', datasetController.cleanDataset);
router.get('/:id/insights', datasetController.getInsights);
router.post('/:id/insights', tierLimit, datasetController.generateInsights);
router.delete('/:id', datasetController.deleteDataset);
router.get('/:id/download', datasetController.downloadDataset);

module.exports = router;
