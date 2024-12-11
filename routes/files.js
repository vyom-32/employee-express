const express = require('express');
const multer = require('multer');
const { promises: fsPromises } = require('fs');
const path = require('path');

const router = express.Router();

// Set up multer for file handling
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

// Helper function to upload the file locally
async function uploadFileLocal(uploadPath, filename, file) {
    const publicUploadPath = path.join('public', uploadPath);
    const fileExtension = path.extname(file.originalname);
    const filePath = path.join(publicUploadPath, `${filename}${fileExtension}`);

    try {
        await fsPromises.writeFile(filePath, file.buffer); // Save file to disk
        console.log('Uploaded file to path:', filePath.replace('\\', '/').replace('public/', ''));
        return { filePath: filePath.replace('\\', '/').replace('public/', '') };
    } catch (error) {
        throw new Error(`Failed to upload file: ${error.message}`);
    }
}

// POST route for file upload
router.post('/upload', upload.any(), async (req, res) => {
    try {
        // Extract body and file data
        const { filePath, fileName } = req.body;
        const file = req.files[0]; // We expect only one file, like in the original NestJS code

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Call the helper function to save the file
        const result = await uploadFileLocal(filePath, fileName, file);

        // Send the result back to the client
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
