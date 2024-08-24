const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  'alrahim_textile_rev_db',
  'root',
  '1234',
  {
    host: 'localhost',  
    dialect: 'mysql'
  }
);

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
    type: DataTypes.INTEGER,
  },
  SOSNumber: {
    type: DataTypes.INTEGER,
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
  }, // Not used
  ProductID: {
    type: DataTypes.TEXT,
  }, // Not used
  ComplaintDetails: {
    type: DataTypes.TEXT,
  },
  ComplaintDate: {
    type: DataTypes.DATE,
  },
  FilePath: {
    type: DataTypes.TEXT,
  },
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
});

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



sequelize.sync().then(() => {
  console.log('Product Data table created successfully!');
}).catch((error) => {
  console.error('Unable to create table : ', error);
});

module.exports = {sequelize, CCMFormData, CCMUserData, CCMFieldsData};