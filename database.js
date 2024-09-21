const { Sequelize, DataTypes } = require('sequelize');

// Database connection
const sequelize = new Sequelize('alrahim_textile_rev_db', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql',
});

// Define CCMFormData model
const CCMFormData = sequelize.define("CCMFormData", {
  Name: {
    type: DataTypes.TEXT,
  },
  Designation: {
    type: DataTypes.TEXT,
  },
  Email: {
    type: DataTypes.TEXT,
  },
  Contact: {
    type: DataTypes.TEXT,
  },
  CustomerName: {
    type: DataTypes.TEXT,
  },
  NatureOfComplaint: {
    type: DataTypes.TEXT,
  },
  NatureOfComplaintOthers: {
    type: DataTypes.TEXT,
  },
  PONumber: {
    type: DataTypes.STRING, // Changed to STRING for larger numbers
  },
  SOSNumber: {
    type: DataTypes.STRING, // Changed to STRING for larger numbers
  },
  BrandName: {
    type: DataTypes.TEXT,
  },
  Product: {
    type: DataTypes.TEXT,
  },
  Article: {
    type: DataTypes.TEXT,
  },
  SizeValue: {
    type: DataTypes.TEXT,
  },
  SizeUnit: {
    type: DataTypes.TEXT,
  },
  Color: {
    type: DataTypes.TEXT,
  },
  Design: {
    type: DataTypes.TEXT,
  },
  ProductID: {
    type: DataTypes.TEXT,
  },
  ComplaintDetails: {
    type: DataTypes.TEXT,
  },
  ComplaintDate: {
    type: DataTypes.DATE,
  },
  // FilePath: {
  //   type: DataTypes.STRING(255), // Keep as STRING(255)
  // },
  ComplaintApprovedQA: {
    type: DataTypes.BOOLEAN,
  },
  ComplaintSuggestionQA: {
    type: DataTypes.TEXT,
  },
  SelectedUsersQA: {
    type: DataTypes.TEXT,
  },
  ComplaintApprovedQMS: {
    type: DataTypes.BOOLEAN,
  },
  ComplaintSuggestionQMS: {
    type: DataTypes.TEXT,
  },
  JustificationProd: {
    type: DataTypes.TEXT,
  },
  ReviewerUsernameQA: {
    type: DataTypes.TEXT,
  },
  ReviewerUsernameQMS: {
    type: DataTypes.TEXT,
  },

  // Add this new field for the file path
  file_path: {
    type: DataTypes.STRING(255), // Or use a larger type if necessary
  },
});

// Define CCMUserData model
const CCMUserData = sequelize.define("CCMUserData", {
  Name: {
    type: DataTypes.TEXT,
  },
  Designation: {
    type: DataTypes.TEXT,
  },
  Email: {
    type: DataTypes.TEXT,
  },
  Password: {
    type: DataTypes.TEXT,
  },
  Contact: {
    type: DataTypes.TEXT,
  },
});

// Define CCMFieldsData model
const CCMFieldsData = sequelize.define("CCMFieldsData", {
  BrandName: {
    type: DataTypes.TEXT,
  },
  Product: {
    type: DataTypes.TEXT,
  },
  Article: {
    type: DataTypes.TEXT,
  },
  Color: {
    type: DataTypes.TEXT,
  },
  Design: {
    type: DataTypes.TEXT,
  },
  ProductID: {
    type: DataTypes.TEXT,
  },
  NOCDropdown: {
    type: DataTypes.TEXT,
  },
  NOCDropdownSubType: {
    type: DataTypes.TEXT,
  },
});

// Define ImagesTable model for storing images
const ImagesTable = sequelize.define("ImagesTable", {
  image_path: {
    type: DataTypes.STRING(255),
  },
  image_data: {
    type: DataTypes.BLOB("long"), // LONGBLOB for image data
  },
});

// Sync the models with the database
sequelize.sync({ force: false }).then(() => {
  console.log('Tables created successfully!');
}).catch((error) => {
  console.error('Unable to create tables:', error);
});

module.exports = { sequelize, CCMFormData, CCMUserData, CCMFieldsData, ImagesTable };
