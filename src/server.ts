import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 6000;

// Middleware for parsing JSON bodies
app.use(express.json());

// Static folder to serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Utility to ensure upload directories exist
const createUploadsDir = (dir: string) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Multer configuration for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'uploads/images/';
        createUploadsDir(dir);
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Multer middleware for handling file uploads
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed.'));
        }
        cb(null, true);
    }
});

// Routes
app.post('/upload', upload.array('images', 5), (req, res) => {
    const files = req.files as Express.Multer.File[];
    const imagePaths = files.map(file => ({
        url: `http://${req.hostname}:${PORT}/uploads/images/${file.filename}`,
        originalName: file.originalname,
    }));
    res.json({ message: 'Images uploaded successfully', images: imagePaths });
});

app.get('/images', (req, res) => {
    const directoryPath = path.join(__dirname, '../uploads/images/');
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to scan files' });
        }
        const images = files.map(file => ({
            url: `http://${req.hostname}:${PORT}/uploads/images/${file}`,
            name: file
        }));
        res.json(images);
    });
});

app.delete('/images/:name', (req, res) => {
    const fileName = req.params.name;
    const filePath = path.join(__dirname, '../uploads/images/', fileName);

    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(500).json({ error: 'File not found' });
        }
        res.json({ message: 'File deleted successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
