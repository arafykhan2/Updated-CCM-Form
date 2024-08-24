const uploadRouter = require("express").Router();
const { parse } = require("csv-parse/sync");
const csvCleaner = require("../csvCleaner");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { ProductData, ReviewsData } = require("../database");

async function insertProducts(csvData) {
  // Code point 1 - Save to unchecked data to variable
  let productData = csvData.map((row) => {
    return {
      ProductUPC: 1001,
      ProductName: row.ProductName,
      ProductPrice: row.ProductPrice,
    };
  });

  // Code Part 2 - Make data unique to remove duplication
  let uniqueProducts = Array.from(
    new Set(productData.map((obj) => JSON.stringify(obj))) //Set constructor removes duplicate values
  );

  // Covert back to String
  uniqueProducts = uniqueProducts.map((objString) => JSON.parse(objString));
  // Use to check uniqueness from input file/avoid copies of data being input

  // Code Point 4 - Cleaning Special Characters
  uniqueProducts = csvCleaner.cleanJSON(uniqueProducts);

  // Code Point 5 - DB fetches all existing products
  const existingProducts = await ProductData.findAll();

  // Matching our product data with existing products
  // If match found, remove that product from product data
  uniqueProducts = uniqueProducts.filter((incomingProduct) => {
    // Use ProductName as the matching key, you can modify this based on your use case
    return !existingProducts.some(
      (existingProduct) =>
        existingProduct.ProductName === incomingProduct.ProductName
    );
  });
  //use to check uniqueness from database/all the data thats already saved

  // Code Part 6 - Save Checked database data to a variable and also back to database
  const insertedProducts = await ProductData.bulkCreate(uniqueProducts);

  // console.log("Inserted Products:", insertedProducts);

  // Code Part 7 - Fetch all products from db (again) to check
  const allProductsAfterInsert = await ProductData.findAll();

  // console.log("All Products After Insert:", allProductsAfterInsert);

  // Return to check
  return allProductsAfterInsert;
}

async function insertReviews(csvData, products) {
  // Code Point (4)1
  const cleanedReviews = csvCleaner.cleanJSON(csvData);

  // Code Point (1)2
  let reviewData = cleanedReviews.map((row) => {
    return {
      ProductID: products.find(
        (product) => product.ProductName === row.ProductName).id, //used to copy existing ids
      ReviewHeading: row.ReviewHeading,
      ReviewBody: row.ReviewBody,
      ReviewValueOrQualityNum1: row.ReviewValueOrQualityNum1 === '' ? null : parseFloat(row.ReviewValueOrQualityNum2),
      ReviewValueOrQualityText1: row.ReviewHeading,
      ReviewValueOrQualityNum2: row.ReviewValueOrQualityNum2 === '' ? null : parseFloat(row.ReviewValueOrQualityNum2),
      ReviewValueOrQualityText2: row.ReviewValueOrQualityText2,
      ReviewTime: row.ReviewTime,
      RecommendationStatus: row.RecommendationStatus,
    };
  });

  // Code Point (5)3
  const existingReviews = await ReviewsData.findAll();

  let uniqueReviews = cleanedReviews.filter((incomingReview) => {
    // Use ProductName as the matching key, you can modify this based on your use case
    return !existingReviews.some(
      (existingReview) =>
        existingReview.ReviewBody === incomingReview.ReviewBody
    );
  });

  console.log(reviewData);

  const insertedReviews = await ReviewsData.bulkCreate(uniqueReviews);

  const allReviewsAfterInsert = await ReviewsData.findAll();

  return allReviewsAfterInsert;
}

uploadRouter.post("/upload", upload.single("csvFile"), async (req, res) => {
  //Make an upload loading indication
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  // const csvData = req.file.buffer.toString("utf8");
  const csvData = parse(req.file.buffer.toString(), { columns: true });

  const products = await insertProducts(csvData);

  const reviews = await insertReviews(csvData, products);

  console.log("uploaded");

  res.redirect("/");
});

module.exports = uploadRouter;
