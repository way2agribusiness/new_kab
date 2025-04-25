import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import ConnectDB from './backend/Config/db.js';
import bodyParser from 'body-parser';
import commonRouter from './backend/Routes/commonRoutes.js';
import productRouter from './backend/Routes/productsRoutes.js';
import adminRouter from './backend/Routes/adminRoutes.js';
import enquiryRouter from './backend/Routes/enquiryRoutes.js';
import fpoRouter from './backend/Routes/FPORoutes.js';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path, {dirname} from 'path';
import fs from 'fs';

// function call connet to database
ConnectDB();

// Load environment variables from a .env file into process.env
dotenv.config();

// Function to get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express(); // Initialize the Express application

// Middleware call
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());



// API route link
app.use('/api/v1/common', commonRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/enquiry', enquiryRouter);
app.use('/api/v1/FPO', fpoRouter);


if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, './frontend/build');
  
  if (!fs.existsSync(frontendBuildPath)) {
      console.error(`Frontend build directory (${frontendBuildPath}) does not exist.`);
      process.exit(1);
  } else {
      console.log(`Frontend build directory: ${frontendBuildPath}`);
  }

  app.use(express.static(frontendBuildPath));

  app.get('*', (req, res) => {
      const indexHtmlPath = path.join(frontendBuildPath, 'index.html');
      if (!fs.existsSync(indexHtmlPath)) {
          console.error(`index.html file (${indexHtmlPath}) not found.`);
          return res.status(404).send('index.html not found');
      } else {
          console.log(`index.html file: ${indexHtmlPath}`);
      }
      res.sendFile(indexHtmlPath);
  });
} else {
  app.get("/", (req, res) => {
      res.send("Server is Running! 🚀");
  });
}

// Set the port from environment variables or use 8000 as a default
const port = process.env.PORT || 5000;

// Start the Express server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is Running at ${port}`.bgYellow.bold);
});
