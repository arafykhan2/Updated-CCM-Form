const PORT = 6969;
const express = require("express");
const bodyParser = require('body-parser');
const PDFDocument = require('pdfkit');
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const session = require("express-session");
const PDFLib = require('pdf-lib');
const { fromBuffer } = require('file-type');
const mysql = require('mysql2');
const { Sequelize } = require('sequelize');
const puppeteer = require('puppeteer');
// const Image = require('../models/Image'); // Import your database model

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

// Set up storage engine
const storage1 = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init upload
const upload1 = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('complaintFile');

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images and PDFs Only!');
  }
}




// const dataUpload = require("./controllers/dataUpload")

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);


app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

const {
  sequelize,
  CCMFormData,
  CCMUserData,
  CCMFieldsData,
} = require("./database");
const { connect } = require("mongoose");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/assets"));
app.use(express.static("public"));
app.set("view engine", "ejs");
// app.use("/", dataUpload);


sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

app.get("/", async (request, response) => {
  response.render("auth-login.ejs");
});

function customLogger(req, res, next) {
  // Log request method, URL, timestamp, and user agent
  const logEntry = `${new Date().toISOString()} - ${req.method} ${req.url} ${req.headers["user-agent"]} - IP: ${req.ip}, Email: ${req.session.user ? req.session.user.Email : 'Not logged in'}`;

  // Write log entry to access.log file
  accessLogStream.write(logEntry + "\n");

  // Call next middleware function
  next();
}

app.use(customLogger);

function isAuthenticated(req, res, next) {
  if (req.session.authenticated) {
    // User is authenticated, proceed to the next middleware or route handler
    next();
  } else {
    // User is not authenticated, redirect to the login page
    res.redirect("/");
  }
}

// const pdfFileName = `form_${Date.now()}.pdf`;
// const pdfDirectory = path.join(__dirname, 'pdfs');
// const pdfFilePath = path.join(pdfDirectory, pdfFileName);
// const outputFolder = path.join(__dirname, '../images/'); // Ensure correct path resolution


// // Extract images from PDF
// async function extractImagesFromPDF(pdfBuffer, outputFolder) {
//   const pdfDoc = await PDFLib.PDFDocument.load(pdfBuffer);
//   const imagePaths = [];

//   for (let i = 0; i < pdfDoc.getPageCount(); i++) {
//     const page = pdfDoc.getPage(i);
//     const xObjects = page.node.Resources?.XObject?.getAll(); // Updated access to XObject

//     if (xObjects) {
//       for (const [key, value] of Object.entries(xObjects)) {
//         const subtype = value.lookup('Subtype');
//         if (subtype?.name === 'Image') {
//           const imageBuffer = value.object.decode();
//           const detectedImageType = await fromBuffer(imageBuffer);
//           const extension = detectedImageType?.ext || 'png';
//           const imagePath = path.join(outputFolder, `image_${i + 1}_${key}.${extension}`);
//           fs.writeFileSync(imagePath, imageBuffer);
//           imagePaths.push(imagePath);
//         }
//       }
//     }
//   }
//   return imagePaths;
// }

// // Save image paths to the database
// async function saveImagesToDB(imagePaths) {
//   for (const imagePath of imagePaths) {
//     const image = fs.readFileSync(imagePath);
//     await Image.create({ imagePath, imageData: image });
//     console.log('Image inserted into database');
//   }
// }

// // const pdfFileName = `form_${Date.now()}.pdf`;
// // const pdfDirectory = path.join(__dirname, 'pdfs');
// // const pdfFilePath = path.join(pdfDirectory, pdfFileName);
// // const outputFolder = path.join(__dirname, '../images/'); // Ensure correct path resolution

// // Ensure the output folder exists
// if (!fs.existsSync(outputFolder)) {
//   fs.mkdirSync(outputFolder, { recursive: true });
// }

// // Main execution flow
// (async () => {
//   try {
//     const pdfBuffer = fs.readFileSync(pdfFilePath); // Read the PDF file
//     const imagePaths = await extractImagesFromPDF(pdfBuffer, outputFolder);
//     await saveImagesToDB(imagePaths); // Save images to DB
//   } catch (error) {
//     console.error('Error processing PDF:', error);
//   }
// })();



// Route to render login page
app.get("/", async (req, res) => {
  res.render("auth-login.ejs");
});

app.get("/ccm-form1", isAuthenticated, async (request, response) => {
  try {
    const CCMUserDataReq = await CCMUserData.findAll();
    const CCMFormDataReq = await CCMFormData.findAll();
    const CCMFieldsDataReq = await CCMFieldsData.findAll();

    // CCMFieldsDataReq = CCMFieldsDataReq.map(dropdownItem => ());

    for (const dropdownItem of CCMFieldsDataReq) {
      let dropdown = dropdownItem.NOCDropdown;
      let subTypes = [];

      if (!dropdown) continue;

      for (const item of CCMFieldsDataReq) {
        if (!item.NOCDropdownSubType) continue;

        let subType = item.NOCDropdownSubType.split(",");

        if (subType[0] == dropdown) {
          subTypes.push(subType[1]);
        }
      }

      dropdownItem.NOCDropdownSubType = subTypes.join(",");
    }

    const userData = request.session.user;

    response.render("ccm-form1.ejs", {
      CCMUserDataReq,
      CCMFormDataReq,
      CCMFieldsDataReq,
      userData,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    response.status(500).send("Internal Server Error");
  }
});

function isAuthenticatedAsAdmin(req, res, next) {
  if (
    req.session.authenticated &&
    req.session.user &&
    req.session.user.Designation === "Admin"
  ) {
    // User is authenticated as admin, proceed to the next middleware or route handler
    next();
  } else {
    // User is not authenticated as admin or not authenticated at all, redirect to the login page
    res.redirect("/");
  }
}

function isAuthenticatedAsQATeam(req, res, next) {
  if (
    req.session.authenticated &&
    req.session.user &&
    req.session.user.Designation === "QA Team"
  ) {
    // User is authenticated as admin, proceed to the next middleware or route handler
    next();
  } else {
    // User is not authenticated as admin or not authenticated at all, redirect to the login page
    res.redirect("/");
  }
}

function isAuthenticatedAsQMSTeam(req, res, next) {
  if (
    req.session.authenticated &&
    req.session.user &&
    req.session.user.Designation === "QMS Team"
  ) {
    // User is authenticated as admin, proceed to the next middleware or route handler
    next();
  } else {
    // User is not authenticated as admin or not authenticated at all, redirect to the login page
    res.redirect("/");
  }
}

app.get("/users-list", isAuthenticatedAsAdmin, async (request, response) => {
  try {
    const CCMUserDataReq = await CCMUserData.findAll();
    const CCMFormDataReq = await CCMFormData.findAll();
    const userData = request.session.user; // Access user details directly from session

    response.render("users-list.ejs", {
      CCMUserDataReq,
      CCMFormDataReq,
      userData,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    response.status(500).send("Internal Server Error");
  }
});

app.get("/products-list", isAuthenticatedAsAdmin, async (request, response) => {
  try {
    const CCMUserDataReq = await CCMUserData.findAll();
    const CCMFormDataReq = await CCMFormData.findAll();
    const CCMFieldsDataReq = await CCMFieldsData.findAll();
    const userData = request.session.user; // Access user details directly from session

    response.render("products-list.ejs", {
      CCMUserDataReq,
      CCMFormDataReq,
      CCMFieldsDataReq,
      userData,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    response.status(500).send("Internal Server Error");
  }
});

app.get("/entries-qa", isAuthenticated,
  (req, res, next) => {
    if (
      req.session.user.Designation === "Admin" ||
      req.session.user.Designation === "QA Team"
    ) {
      next();
    } else {
      res.sendStatus(403); // Forbidden
    }
  },
  async (request, response) => {
    const { id, suggestion } = request.query;
    try {
      const CCMUserDataReq = await CCMUserData.findAll();
      const CCMFormDataReq = await CCMFormData.findAll();
      const userData = request.session.user; // Access user details directly from session

      response.render("entries-qa.ejs", {
        CCMUserDataReq,
        CCMFormDataReq,
        userData,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      response.status(500).send("Internal Server Error");
    }
  });

app.get("/entries-norm-user", isAuthenticated, async (request, response) => {
  try {
    const CCMUserDataReq = await CCMUserData.findAll();
    const CCMFormDataReq = await CCMFormData.findAll();
    const userData = request.session.user; // Access user details directly from session

    response.render("entries-norm-user.ejs", {
      CCMUserDataReq,
      CCMFormDataReq,
      userData,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    response.status(500).send("Internal Server Error");
  }
});

app.get("/entries-qms", isAuthenticated,
  (req, res, next) => {
    if (
      req.session.user.Designation === "Admin" ||
      req.session.user.Designation === "QMS Team"
    ) {
      next();
    } else {
      res.sendStatus(403); // Forbidden
    }
  },
  async (request, response) => {
    const { id, suggestion } = request.query;
    try {
      const CCMUserDataReq = await CCMUserData.findAll();
      const CCMFormDataReq = await CCMFormData.findAll();
      const userData = request.session.user; // Access user details directly from session

      response.render("entries-qms.ejs", {
        CCMUserDataReq,
        CCMFormDataReq,
        userData,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      response.status(500).send("Internal Server Error");
    }
  }
);

app.get("/entry-details/:entryID", isAuthenticated,
  async (request, response) => {
    try {
      const entryID = request.params.entryID;
      const entryData = await CCMFormData.findByPk(entryID);

      const CCMUserDataReq = await CCMUserData.findAll();
      const CCMFormDataReq = await CCMFormData.findAll();
      const userData = request.session.user; // Access user details directly from session

      // Format the complaint date
      const formattedComplaintDate = entryData.ComplaintDate
        ? entryData.ComplaintDate.toLocaleDateString("en-CA")
        : "";

      response.render("entry-details.ejs", {
        CCMUserDataReq,
        CCMFormDataReq,
        userData,
        entryData,
        entryID,
        formattedComplaintDate,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      response.status(500).send("Internal Server Error");
    }
  }
);

app.get("/entry-details-edit/:entryID", isAuthenticated, async (request, response) => {
  try {
    const entryID = request.params.entryID;

    // Fetch the entry data by primary key (entryID)
    const entryData = await CCMFormData.findByPk(entryID);

    // Check if entryData exists
    if (!entryData) {
      console.error(`No entry found for entryID: ${entryID}`);
      return response.status(404).send("Entry not found");
    }

    console.log("\nentryData Values for entryID:", entryID);
    console.log(entryData);

    // Fetch additional data
    const CCMUserDataReq = await CCMUserData.findAll();
    const CCMFormDataReq = await CCMFormData.findAll();
    const userData = request.session.user; // Access user details directly from session

    // Safely format the complaint date if available
    const formattedComplaintDate = entryData.ComplaintDate
      ? entryData.ComplaintDate.toLocaleDateString("en-CA")
      : "";

    // Render the edit page with the required data
    response.render("entry-details-edit.ejs", {
      CCMUserDataReq,
      CCMFormDataReq,
      userData,
      entryData,
      entryID,
      formattedComplaintDate,
    });

  } catch (error) {
    console.error("Error fetching data:", error);
    response.status(500).send("Internal Server Error");
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await CCMUserData.findOne({
      where: {
        email: email,
        password: password,
      },
    });

    if (user) {
      req.session.authenticated = true;
      req.session.user = {
        Name: user.Name,
        Designation: user.Designation,
        Email: user.Email,
        Contact: user.Contact,
      };

      if (user.Designation === 'Production Team') {
        res.redirect("/entries-norm-user");
      } else {
        res.redirect("/ccm-form1");
      }
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/logout", isAuthenticated, (req, res) => {
  // Destroy the session to log the user out
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).send("Internal Server Error");
    } else {
      // Redirect the user to the login page or any other desired page after logout
      res.redirect("/");
    }
  });
});

app.post("/removeUser", isAuthenticatedAsAdmin, async (req, res) => {
  const { userId } = req.body;

  try {
    // Check if the user exists
    const user = await CCMUserData.findOne({
      where: {
        id: userId,
      },
    });

    if (user) {
      // User found, delete the user
      await CCMUserData.destroy({
        where: {
          id: userId,
        },
      });

      // Redirect back to the users-list page
      res.redirect("/users-list");
    } else {
      // User not found
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error removing user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



app.get('/generatePDF', (req, res) => {
  res.render('template', {
      customerData: {
          customerName: "ARK",
          poNumber: "12345690",
          sosNumber: "111111111111",
          brandName: "Threshold",
          product: "Solid towel",
          article: "Beach towel",
          sizeValue: "12x12",
          sizeUnit: "In",
          color: "blue",
          design: "black",
          productId: "123456789123",
          complaintDetails: "Product is fariq !!!",
          complaintDate: "2024-10-17",
          natureOfComplaint: "Measurement",
          otherComplaints: "",
          filePath: "1.jpg"
          
  
      }
  });
});

// Route to generate PDF (POST request)
app.post('/generatePDF', async (req, res) => {
  try {
      // Launch Puppeteer browser
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Load the EJS template as HTML
      const content = await res.render('template', {
          customerData: req.body
      }, (err, html) => html);

      // Set content in Puppeteer
      await page.setContent(content, { waitUntil: 'networkidle0' });

      // Generate PDF
      const pdfBuffer = await page.pdf({
          format: 'A4',
          printBackground: true
      });

      // Close the browser
      await browser.close();

      // Send the PDF as a response
      res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'pdfs; filename=customer_complaint_form.pdf',
      });
      res.send(pdfBuffer);

  } catch (error) {
      console.error("Error generating PDF: ", error);
      res.status(500).send("Error generating PDF");
  }
});


// // Import the ImagesTable from the database file
// const { ImagesTable } = require('./database');

// // Function to save the file path in the ImagesTable database
// async function saveFilePathToDatabase(filePath, imageData = null) {
//   try {
//     // Create a new entry in the ImagesTable
//     const newImageEntry = await ImagesTable.create({
//       image_path: filePath,
//       image_data: imageData, // Optional: store image data as BLOB
//     });
//     console.log('File path uploaded to database:', newImageEntry);
//   } catch (error) {
//     console.error('Error uploading file path:', error);
//   }
// }

// Function to save the file path in the CCMFormData table
async function saveFilePathToCCMFormData(filePath, PONumber) {
  try {
    // Debugging logs
    console.log("File Path:", filePath);
    console.log("PO Number:", PONumber);

    // Ensure the file path is a valid string
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('Invalid file path provided');
    }

    // Update the existing CCMFormData entry with the file path, using PONumber as a unique identifier
    const updatedEntry = await CCMFormData.update(
      { file_path: filePath },  // Update only the file_path field
      { where: { PONumber: PONumber } } // Use PONumber to update the right record
    );

    // Check if the update was successful
    if (updatedEntry[0] === 0) {
      console.error('No record found to update with the given PO Number');
    } else {
      console.log('File path successfully uploaded to the database');
    }
  } catch (error) {
    console.error('Error uploading file path:', error.message);
  }
}

let lastSubmittedData = null;

// Function to create the PDF
function createPDF(doc, data, outputPath) {
  const tableData = [
    ['Field', 'Value'],
    ['Customer Name', data.CustomerName],
    ['PO Number', data.PONumber],
    ['SOS Number', data.SOSNumber],
    ['Brand Name', data.BrandName],
    ['Product', data.Product],
    ['Article', data.Article],
    ['Size Value', data.SizeValue],
    ['Size Unit', data.SizeUnit],
    ['Color', data.Color],
    ['Design', data.Design],
    ['Product ID', data.ProductID],
    ['Complaint Details', data.ComplaintDetails],
    ['Complaint Date', data.ComplaintDate],
    ['Nature of Complaint', data.NatureOfComplaint],
    ['Other Nature of Complaints', data.NatureOfComplaintOthers],
    ['File Path', data.uploadFiles]
  ];

  // Function to draw the table
  function drawTable(doc, startX, startY, rowHeight, tableData) {
    let y = startY;
    tableData.forEach((row) => {
      let x = startX;
      row.forEach((cell) => {
        doc.rect(x, y, 200, rowHeight).stroke();
        doc.text(cell, x + 5, y + 5, { width: 190 });
        x += 200;
      });
      y += rowHeight;
    });
  }

  // Create and draw the table
  drawTable(doc, 50, 50, 30, tableData);

  // Finalize the PDF file
  doc.end();



  // // Fetch the file path from the data object
  // const filePath = data.uploadFiles;

  // // Call the function to upload the file path to the database
  // saveFilePathToDatabase(filePath);
  // Fetch the file path from the data object
  // Fetch the file path from the data object
  // Fetch the file path from the data object
  const filePath = data.uploadFiles;  // Ensure this contains the correct file path
  const PONumber = data.PONumber;  // Use PONumber to identify the record

  // Debugging logs
  console.log("Saving file path:", filePath);
  console.log("PO Number:", PONumber);

  // Call the function to upload the file path to CCMFormData using PONumber
  saveFilePathToCCMFormData(filePath, PONumber);
  
}

// POST route to handle form submission
app.post('/submit-form', isAuthenticated, upload.single('uploadFiles'), async (req, res) => {
  const {
    CustomerName,
    NatureOfComplaint,
    NatureOfComplaintOthers,
    PONumber,
    SOSNumber,
    BrandName,
    Product,
    Article,
    SizeValue,
    SizeUnit,
    Color,
    Design,
    ProductID,
    ComplaintDetails,
    ComplaintDate,
    Name,
    Designation,
    Email,
    Contact,
  } = req.body;

  const FilePath = req.file ? req.file.path : null;

  try {
    const newFormData = await CCMFormData.create({
      CustomerName,
      NatureOfComplaint: Array.isArray(NatureOfComplaint) ? NatureOfComplaint.join(',') : NatureOfComplaint,
      NatureOfComplaintOthers,
      PONumber,
      SOSNumber,
      BrandName,
      Product,
      Article,
      SizeValue,
      SizeUnit,
      Color,
      Design,
      ProductID,
      ComplaintDetails,
      ComplaintDate,
      Name,
      Designation,
      Email,
      Contact,
      FilePath,
    });

    // Generate PDF
    const pdfFileName = `form_${Date.now()}.pdf`;
    const pdfDirectory = path.join(__dirname, 'pdfs');
    const pdfFilePath = path.join(pdfDirectory, pdfFileName);

    // Ensure the directory exists
    if (!fs.existsSync(pdfDirectory)) {
      fs.mkdirSync(pdfDirectory);
    }

    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(pdfFilePath);
    doc.pipe(writeStream);

    // Create the PDF
    createPDF(doc, req.body, pdfFilePath);

    // Save the last submitted data
    lastSubmittedData = {
      ...req.body,
      NatureOfComplaint: Array.isArray(NatureOfComplaint) ? NatureOfComplaint.join(',') : NatureOfComplaint,
      FilePath,
    };

    // Once the PDF has been written, send a response
    // writeStream.on('finish', () => {
    //   res.json({ success: true, downloadLink: `/download-pdf/${pdfFileName}` });
    // });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error processing the form.' });
  }
});





// app.get('/generate-pdf', async (req, res) => {
//   try {
//     if (!lastSubmittedData) {
//       return res.status(400).json({ success: false, message: 'No form data available for PDF generation.' });
//     }

//     const pdfFileName = `form_${Date.now()}.pdf`;
//     const pdfDirectory = path.join(__dirname, 'pdfs');
//     const pdfFilePath = path.join(pdfDirectory, pdfFileName);

//     // Ensure the directory exists
//     if (!fs.existsSync(pdfDirectory)) {
//       fs.mkdirSync(pdfDirectory);
//     }

//     const doc = new PDFDocument();
//     const writeStream = fs.createWriteStream(pdfFilePath);
//     doc.pipe(writeStream);

//     // Create the PDF
//     createPDF(doc, lastSubmittedData, pdfFilePath);

//     // Once the PDF has been written, respond with the PDF as an inline view
//     writeStream.on('finish', () => {
//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader('Content-Disposition', `inline; filename="${pdfFileName}"`);
//       fs.createReadStream(pdfFilePath).pipe(res);
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Error generating the PDF.' });
//   }
// });


// // Route to download the generated PDF
// app.get('/download-pdf/:fileName', (req, res) => {
//   const filePath = path.join(__dirname, 'pdfs', req.params.fileName);
//   res.download(filePath);
// });

// Handle the file upload route
app.post('/uploads', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.render('ccm-form1.ejs', {
        msg: err
      });
    } else {
      if (req.file == undefined) {
        res.render('ccm-form1.ejs', {
          msg: 'No file selected!'
        });
      } else {
        res.render('ccm-form1.ejs', {
          msg: 'File uploaded successfully!',
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});

app.post("/edit-form/:entryID", isAuthenticated,
  upload.single("file"),
  async (req, res) => {
    const entryID = req.params.entryID;
    const {
      CustomerName,
      NatureOfComplaint,
      NatureOfComplaintOthers, // Ensure this field is included in the request body
      PONumber,
      SOSNumber,
      BrandName,
      Product,
      Article,
      SizeValue,
      SizeUnit,
      Color,
      Design,
      ProductID,
      ComplaintDetails,
      ComplaintDate,
      Name,
      Designation,
      Email,
      Contact,
    } = req.body;

    try {
      // Update the existing CCMFormData instance with the edited form data
      await CCMFormData.update(
        {
          CustomerName: CustomerName,
          NatureOfComplaint: NatureOfComplaint.join(", "),
          NatureOfComplaintOthers: NatureOfComplaintOthers, // Save "Other Nature(s) of Complaints"
          PONumber: PONumber,
          SOSNumber: SOSNumber,
          BrandName: BrandName,
          Product: Product,
          Article: Article,
          SizeValue: SizeValue,
          SizeUnit: SizeUnit,
          Color: Color,
          Design: Design,
          ProductID: ProductID,
          ComplaintDetails: ComplaintDetails,
          ComplaintDate: ComplaintDate,
          Name: Name,
          Designation: Designation,
          Email: Email,
          Contact: Contact,
          File: req.file ? req.file.buffer : null,
        },
        {
          where: { id: entryID }, // Specify the entryID to update
        }
      );

      // Redirect to a success page or the form page with a success message
      res.redirect("/ccm-form1");
    } catch (error) {
      console.error("Error updating form data:", error);
      // Handle the error and render an error page or the form page with an error message
      res.status(500).send("Internal Server Error");
    }
  }
);

// start fixing post reqs
app.post("/updateSuggestionQA", isAuthenticated,
  (req, res, next) => {
    if (
      req.session.user.Designation === "Admin" ||
      req.session.user.Designation === "QA Team"
    ) {
      next();
    } else {
      res.sendStatus(403); // Forbidden
    }
  },
  async (request, response) => {
    const { id, suggestion } = request.query;
    try {
      const entry = await CCMFormData.findByPk(id);
      if (entry) {
        await entry.update({ ComplaintSuggestionQA: suggestion });
        response.sendStatus(200);
      } else {
        response.sendStatus(404);
      }
    } catch (error) {
      console.error("Error updating suggestion:", error);
      response.status(500).send("Internal Server Error");
    }
  }
);

app.post("/updateJustification", isAuthenticated,
  (req, res, next) => {
    if (
      req.session.user.Designation === "Admin" ||
      req.session.user.Designation === "Production Team"
    ) {
      next();
    } else {
      res.sendStatus(403); // Forbidden
    }
  },
  async (request, response) => {
    const { id, justification } = request.query;
    try {
      const entry = await CCMFormData.findByPk(id);
      if (entry) {
        await entry.update({ JustificationProd: justification });
        response.sendStatus(200);
      } else {
        response.sendStatus(404);
      }
    } catch (error) {
      console.error("Error updating justification:", error);
      response.status(500).send("Internal Server Error");
    }
  }
);


app.post(
  "/updateSuggestionQMS",
  isAuthenticated,
  (req, res, next) => {
    if (
      req.session.user.Designation === "Admin" ||
      req.session.user.Designation === "QMS Team"
    ) {
      next();
    } else {
      res.sendStatus(403); // Forbidden
    }
  },
  async (request, response) => {
    const { id, suggestion } = request.query;
    try {
      const entry = await CCMFormData.findByPk(id);
      if (entry) {
        await entry.update({ ComplaintSuggestionQMS: suggestion });
        response.sendStatus(200);
      } else {
        response.sendStatus(404);
      }
    } catch (error) {
      console.error("Error updating suggestion:", error);
      response.status(500).send("Internal Server Error");
    }
  }
);

app.post(
  "/removeSuggestionQA",
  isAuthenticated,
  (req, res, next) => {
    if (
      req.session.user.Designation === "Admin" ||
      req.session.user.Designation === "QA Team"
    ) {
      next();
    } else {
      res.sendStatus(403); // Forbidden
    }
  },
  async (request, response) => {
    const { id } = request.query;
    try {
      const entry = await CCMFormData.findByPk(id);
      if (entry) {
        await entry.update({ ComplaintSuggestionQA: null });
        response.sendStatus(200);
      } else {
        response.sendStatus(404);
      }
    } catch (error) {
      console.error("Error removing suggestion:", error);
      response.status(500).send("Internal Server Error");
    }
  }
);

app.post(
  "/removeJustification",
  isAuthenticated,
  (req, res, next) => {
    if (
      req.session.user.Designation === "Admin" ||
      req.session.user.Designation === "Production Team"
    ) {
      next();
    } else {
      res.sendStatus(403); // Forbidden
    }
  },
  async (request, response) => {
    const { id } = request.query;
    try {
      const entry = await CCMFormData.findByPk(id);
      if (entry) {
        await entry.update({ JustificationProd: null });
        response.sendStatus(200);
      } else {
        response.sendStatus(404);
      }
    } catch (error) {
      console.error("Error removing Justification:", error);
      response.status(500).send("Internal Server Error");
    }
  }
);


app.post(
  "/removeSuggestionQMS",
  isAuthenticated,
  (req, res, next) => {
    if (
      req.session.user.Designation === "Admin" ||
      req.session.user.Designation === "QMS Team"
    ) {
      next();
    } else {
      res.sendStatus(403); // Forbidden
    }
  },
  async (request, response) => {
    const { id } = request.query;
    try {
      const entry = await CCMFormData.findByPk(id);
      if (entry) {
        await entry.update({ ComplaintSuggestionQMS: null });
        response.sendStatus(200);
      } else {
        response.sendStatus(404);
      }
    } catch (error) {
      console.error("Error removing suggestion:", error);
      response.status(500).send("Internal Server Error");
    }
  }
);

app.post(
  "/add-user",
  isAuthenticatedAsAdmin,
  upload.none(),
  async (req, res) => {
    const { Name, Email, Password, Contact, Designation } = req.body;

    try {
      // Check if the user with the provided email already exists
      const existingUser = await CCMUserData.findOne({
        where: { Email: Email },
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }

      // Create a new user in the CCMUserData table
      const newUser = await CCMUserData.create({
        Name: Name,
        Email: Email,
        Password: Password,
        Contact: Contact,
        Designation: Designation,
      });

      res
        .status(201)
        .json({ message: "User added successfully", user: newUser });
    } catch (error) {
      console.error("Error adding new user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.post(
  "/add-brandname",
  isAuthenticatedAsAdmin,
  upload.none(),
  async (req, res) => {
    const { BrandName } = req.body;

    try {
      // Check if the user with the provided email already exists
      const existingBrandName = await CCMFieldsData.findOne({
        where: { BrandName: BrandName },
      });

      if (existingBrandName) {
        return res
          .status(400)
          .json({ message: "This Brand Name already exists" });
      }

      // Create a new user in the CCMUserData table
      const newBrandName = await CCMFieldsData.create({
        BrandName: BrandName,
      });

      res
        .status(201)
        .json({
          message: "Brand Name added successfully",
          brandName: newBrandName,
        });
    } catch (error) {
      console.error("Error adding new Brand Name:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.post(
  "/add-product",
  isAuthenticatedAsAdmin,
  upload.none(),
  async (req, res) => {
    const { Product } = req.body;

    try {
      // Check if the user with the provided email already exists
      const existingProduct = await CCMFieldsData.findOne({
        where: { Product: Product },
      });

      if (existingProduct) {
        return res.status(400).json({ message: "This Product already exists" });
      }

      // Create a new user in the CCMUserData table
      const newProduct = await CCMFieldsData.create({
        Product: Product,
      });

      res
        .status(201)
        .json({ message: "Product added successfully", Product: newProduct });
    } catch (error) {
      console.error("Error adding new Product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.post(
  "/add-article",
  isAuthenticatedAsAdmin,
  upload.none(),
  async (req, res) => {
    const { Article } = req.body;

    try {
      // Check if the user with the provided email already exists
      const existingArticle = await CCMFieldsData.findOne({
        where: { Article: Article },
      });

      if (existingArticle) {
        return res.status(400).json({ message: "This Article already exists" });
      }

      // Create a new user in the CCMUserData table
      const newArticle = await CCMFieldsData.create({
        Article: Article,
      });

      res
        .status(201)
        .json({ message: "Article added successfully", article: newArticle });
    } catch (error) {
      console.error("Error adding new Article:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.get("/getSelectedUsers", isAuthenticated, async (req, res) => {
  const { entryId } = req.query; // Change 'id' to 'entryId' to match frontend query parameter

  try {
    // Find the entry in the database by its ID
    const entry = await CCMFormData.findByPk(entryId);

    if (entry) {
      // If the entry is found, retrieve the selected users and send them as a response
      const selectedUsers = entry.SelectedUsersQA;
      res.status(200).json({ selectedUsers });
    } else {
      // If the entry is not found, send a 404 response
      res.status(404).json({ message: "Entry not found" });
    }
  } catch (error) {
    // If an error occurs during the retrieval, send a 500 response
    console.error("Error retrieving selected users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/acceptComplaintQA", isAuthenticated, (req, res, next) => {
  if (
    req.session.user.Designation === "Admin" ||
    req.session.user.Designation === "QA Team"
  ) {
    next();
  } else {
    res.sendStatus(403); // Forbidden
  }
},
  async (req, res) => {
    const { id, status, selectedUsers } = req.query;
    const userData = req.session.user;

    try {
      const entry = await CCMFormData.findByPk(id);

      if (entry) {
        await entry.update({
          ComplaintApprovedQA: status,
          SelectedUsersQA: selectedUsers,
          ReviewerUsernameQA: userData.Name,
        });

        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.error("Error updating complaint status of QA:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

app.post(
  "/rejectComplaintQA",
  isAuthenticated,
  (req, res, next) => {
    if (
      req.session.user.Designation === "Admin" ||
      req.session.user.Designation === "QA Team"
    ) {
      next();
    } else {
      res.sendStatus(403); // Forbidden
    }
  },
  async (req, res) => {
    const { id, status } = req.query;
    const userData = req.session.user;

    try {
      const entry = await CCMFormData.findByPk(id);

      if (entry) {
        await entry.update({
          ComplaintApprovedQA: status,
          ReviewerUsernameQA: userData.Name,
        });

        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.error("Error updating complaint status of QA:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

app.post(
  "/acceptComplaintQMS",
  isAuthenticated,
  (req, res, next) => {
    if (
      req.session.user.Designation === "Admin" ||
      req.session.user.Designation === "QMS Team"
    ) {
      next();
    } else {
      res.sendStatus(403); // Forbidden
    }
  },
  async (req, res) => {
    const { id, status, selectedUsers } = req.query;
    const userData = req.session.user;

    try {
      const entry = await CCMFormData.findByPk(id);

      if (entry) {
        await entry.update({
          ComplaintApprovedQMS: status,
          SelectedUsersQA: selectedUsers,
          ReviewerUsernameQMS: userData.Name,
        });

        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.error("Error updating complaint status of QMS:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

app.post(
  "/rejectComplaintQMS",
  isAuthenticated,
  (req, res, next) => {
    if (
      req.session.user.Designation === "Admin" ||
      req.session.user.Designation === "QMS Team"
    ) {
      next();
    } else {
      res.sendStatus(403); // Forbidden
    }
  },
  async (req, res) => {
    const { id, status } = req.query;
    const userData = req.session.user;

    try {
      const entry = await CCMFormData.findByPk(id);

      if (entry) {
        await entry.update({
          ComplaintApprovedQMS: status,
          ReviewerUsernameQMS: userData.Name,
        });

        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.error("Error updating complaint status of QMS:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
