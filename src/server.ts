import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

// Static folder to serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


// app.use('/', (req, res) => {
//     res.send('Hello, World!');
// })

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

        const images = files.map(file => {
            const filePath = path.join(directoryPath, file);
            const stats = fs.statSync(filePath);  // Get file stats (size, creation date, etc.)

            console.log(filePath)
            
            return {
                url: `http://${req.hostname}:${PORT}/uploads/images/${file}`,
                name: file,
                size: stats.size, // File size in bytes
                createdAt: stats.birthtime, // File creation date
            };
        });

        res.json(images);
    });
});


app.get('/image/:name', (req, res) => {
    const imageName = req.params.name;
    const imagePath = path.join(__dirname, '../uploads/images/', imageName);

    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        res.status(404).json({ error: 'Image not found' });
    }
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

// New route to delete all images
app.delete('/images', (req, res) => {
    const directoryPath = path.join(__dirname, '../uploads/images/');
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to scan files' });
        }
        if (files.length === 0) {
            return res.json({ message: 'No files to delete' });
        }

        // Delete each file
        const deletePromises = files.map(file => {
            const filePath = path.join(directoryPath, file);
            return new Promise((resolve, reject) => {
                fs.unlink(filePath, err => {
                    if (err) reject(err);
                    else resolve(true);
                });
            });
        });

        Promise.all(deletePromises)
            .then(() => res.json({ message: 'All files deleted successfully' }))
            .catch(() => res.status(500).json({ error: 'Error deleting some files' }));
    });
});

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

