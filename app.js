require('dotenv').config();

const express = require('express');
const firebaseAdmin = require('firebase-admin');
const multer = require('multer');
const cors = require('cors');
const path = require("path");
const { v4: uuidv4 } = require('uuid');

// Initialize Firebase Admin SDK
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const app = express();

app.use(cors());
app.use(express.json());

// ⚙️ Multer for in-memory file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🧠 Upload multiple files and store in "vmm/" folder
app.post('/upload', upload.array('files', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: true, message: 'No files uploaded.' });
        }

        const bucket = firebaseAdmin.storage().bucket();
        const uploadedFiles = [];

        for (const file of req.files) {
            const uniqueId = uuidv4();
            const fileName = `${Date.now()}-${uniqueId}-${file.originalname}`;

            // Store files inside "vmm/" folder in Firebase Storage
            const blob = bucket.file(`vmm/${fileName}`);

            await blob.save(file.buffer, {
                metadata: {
                    contentType: file.mimetype,
                    metadata: {
                        firebaseStorageDownloadTokens: uniqueId,
                    },
                },
            });

            // Create download URL
            const baseURL = 'https://firebasestorage.googleapis.com/v0/b/';
            const downloadUrl = `${baseURL}${bucket.name}/o/${encodeURIComponent(`vmm/${fileName}`)}?alt=media&token=${uniqueId}`;

            uploadedFiles.push({
                name: file.originalname,
                url: downloadUrl,
            });
        }

        return res.status(200).json({
            error: false,
            message: 'Files uploaded successfully to vmm/ folder',
            files: uploadedFiles,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ error: true, message: error.message });
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(process.env.PORT, () => {
    console.log(`✅ Server running at http://localhost:${process.env.PORT}`);
});
