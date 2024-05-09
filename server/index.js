

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const crypto = require("crypto");

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Connect to DB
const mongoURI =
  "replace with you connection string";

  

const conn = mongoose.createConnection(mongoURI);

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });







const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
// Define a schema for user
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String  
});
const User = mongoose.model('User', userSchema);




const AnnotateSchema = new mongoose.Schema({
  img: { type: String, unique: true },
  annotation: String
});
const  Anotation= mongoose.model('Anotation', AnnotateSchema);




// Route for user registration
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);
  try {
    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("exist user already")
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.log("no user already")
    // Create a new user and save to MongoDB
    const newUser = new User({ email, password });
    await newUser.save();

    res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log("hereIam")
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(email)
  try {
    // Check if user with the provided email exists
    const user = await User.findOne({ email });
    console.log(user) 
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Compare the provided password with the hashed password stored in the database
    if (password !== user.password) {
      
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // If email and password match, login successful
    console.log("Successful login")
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Endpoint to get all images
app.get("/allimages", (req, res) => {
  // Retrieve all images from your database
  gfs.files.find().toArray((err, files) => {
    if (err) {
      console.error("Error fetching images:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    // If no images found, return empty array
    if (!files || files.length === 0) {
      return res.status(404).json({ error: "No images found" });
    }

    // Filter out non-image files
    const images = files.filter(
      file =>
        file.contentType === "image/jpeg" || file.contentType === "image/png"
    );

    // Send the array of image objects as a response
    res.json(images);
  });
});





let gfs;

conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
  console.log("Connection Successful");
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: "files"
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });
// Parse incoming request bodies with a maximum payload size of 50MB
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Handle file uploads
app.use(upload.any());




app.post("/", (req, res, next) => {
  console.log('Request Body:', req.body);

  // Parse the annotations from the request body
  const annotations = {};
  const annotationsData = req.body.annotations || [];

  if (Array.isArray(annotationsData)) {
    for (const annotation of annotationsData) {
      const parsedAnnotation = JSON.parse(annotation);
      annotations[parsedAnnotation.filePath] = parsedAnnotation.annotation;
    }
  } else {
    console.warn('Annotations data is not an array:', annotationsData);
  }

  // Extract file paths and annotation values
  const filePaths = Object.keys(annotations);
  const annotationValues = Object.values(annotations);

  // Create an array of objects for saving annotations
  const annotationData = filePaths.map((filePath, index) => ({
    img: filePath,
    annotation: annotationValues[index],
  }));

  // Save annotations to the database
  Anotation.insertMany(annotationData)
    .then(() => {
      console.log('Annotations saved successfully');
      // Additional logic or response
      next();
    })
    .catch((err) => {
      console.error('Error saving annotations:', err);
      // Error handling
      res.status(500).json({ error: 'Error saving annotations' });
    });
}, upload.array('images'), (req, res, err) => {

  return res.status(200).json({ message: "Uploaded successfully" });
});

app.get("/:filename", (req, res) => {
  const filenames = req.params.filename.split(",");
  gfs.files.find({ filename: { $in: filenames } }).toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({ err: "No files exist" });
    }

    const invalidFiles = files.filter(
      (file) =>
        file.contentType !== "image/jpeg" && file.contentType !== "image/png"
    );
    if (invalidFiles.length > 0) {
      return res.status(404).json({ err: "Some files are not images" });
    }

    const readstreams = files.map((file) => gfs.createReadStream(file.filename));
    const mergedStreams = require("merge-stream")(...readstreams);
    mergedStreams.pipe(res);
  });
});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
