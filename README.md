Firebase Storage Upload Service

This project is a Node.js + Express backend API that allows uploading multiple files to Firebase Cloud Storage using Multer (in-memory uploads) and the Firebase Admin SDK.

It supports:

📂 Multiple file uploads in a single request,

☁️ Direct upload to Firebase Storage,

🔐 Secure setup using environment variables,

🆔 Unique file naming using UUID,

🔗 Automatic public download URL generation,

📁 Organized uploads inside a vmm/ folder,

This service is ideal for applications that need secure and scalable file storage such as admin panels, student portals, document management systems, or SaaS platforms.

Tech Stack:
Node.js, Express.js, Firebase Admin SDK, Multer, UUID, dotenv, CORS