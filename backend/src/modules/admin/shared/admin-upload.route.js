const express = require('express');
const router = express.Router();
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { upload } = require('../../../middleware/upload.middleware');
const { adminAuthMiddleware } = require('../../../middleware/auth.middleware');
const { successResponse } = require('../../../core/response');

// Ensure uploads dir exists
const uploadsDir = path.join(__dirname, '../../../../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// POST /api/admin/upload
// Body: multipart/form-data with `image` field
// Optional query: ?type=category|product|banner (affects output size)
router.post('/', adminAuthMiddleware, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const type = req.query.type || 'product';

    // Size presets for different image types
    const presets = {
      category: { width: 800, height: 600 },
      product:  { width: 800, height: 800 },
      banner:   { width: 1400, height: 500 },
    };

    const preset = presets[type] || presets.product;

    // Generate unique filename
    const uniqueName = crypto.randomBytes(16).toString('hex');
    const filename = `${type}_${uniqueName}.webp`;
    const outputPath = path.join(uploadsDir, filename);

    // Process with sharp: resize with cover fit, convert to webp
    await sharp(req.file.buffer)
      .resize(preset.width, preset.height, {
        fit: 'cover',
        position: 'center',
      })
      .webp({ quality: 85 })
      .toFile(outputPath);

    // Build the public URL
    const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
    const imageUrl = `${baseUrl}/uploads/${filename}`;

    return successResponse(res, 200, 'Image uploaded successfully', { imageUrl, filename });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
