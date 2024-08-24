const PORT = 3769;
const express = require("express");
const multer = require("multer");
const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
  sequelize,
  PDTData,
  PDTSentimentScores,
  PDTSentimentCalculations,
  ReviewsData,
  ProductReview,
} = require("./database");
const Sentiment = require("sentiment");
const analyser = new Sentiment();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/assets"));
app.use(express.static("public"));
app.set("view engine", "ejs");

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

app.get("/", async (request, response) => {
  const pdt = await PDTData.findAll();
  // InsertSentiment();
  response.render("index.ejs", { pdt });
});

//comment function in get above since itll throw data constantly
async function InsertSentiment() {
  const reviews = await PDTData.findAll();

  for (const review of reviews) {
    const review_head_sentiment = analyser.analyze(review.pdt_review_heading);

    const review_body_sentiment = analyser.analyze(review.pdt_review_text);

    const type_determiner =
      review_head_sentiment.score + review_body_sentiment.score;

    const sentiment_type = type_determiner < 0 ? "Negative" : "Positive";

    const sentimentScore = PDTSentimentScores.build({
      review_id: review.id,

      head_score: review_head_sentiment.score,

      body_score: review_body_sentiment.score,

      head_comparative: review_head_sentiment.comparative,

      body_comparative: review_body_sentiment.comparative,

      defects_keyword: "Pilling",

      sentiment: sentiment_type,

      positive_words_head: review_head_sentiment.positive.toString(),

      negative_words_head: review_head_sentiment.negative.toString(),

      positive_words_body: review_body_sentiment.positive.toString(),

      negative_words_body: review_body_sentiment.negative.toString(),
    });
    await sentimentScore.save();
    console.log("Sentiment was saved to the database!");
  }
}

app.get("/export-table.ejs", async (request, response) => {
  const products = await PDTData.findAll();
  response.render("export-table.ejs", { products });
});

app.get("/detailed-product-page.ejs", async (request, response) => {
  const pdt = await PDTData.findAll();
  response.render("detailed-product-page.ejs", { pdt });
});

app.get("/index.ejs", async (request, response) => {
  const pdt = await PDTData.findAll();
  response.render("index.ejs", { pdt });
});

app.get("/detailed-defect-page.ejs", async (request, response) => {
  const pdt = await PDTData.findAll();
  response.render("detailed-defect-page.ejs", { pdt });
});

app.get("/editable-table.ejs", async (request, response) => {
  const pdt = await PDTData.findAll();
  response.render("editable-table.ejs", { pdt });
});

app.post("/upload", upload.single("csvFile"), async (req, res) => {
  //Make an upload loading indication
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const csvData = req.file.buffer.toString("utf8");

  console.log("uploaded");
  console.log(csvData);

  // Split CSV data into rows
  const rows = csvData.split('\n');

  // Extract column headers
  const headers = rows[0].split(',');

  // Find the indices of the required columns
  const columnIndex = {
    ProductID: headers.indexOf('ProductID'),
    ReviewHeading: headers.indexOf('ReviewHeading'),
    ReviewBody: headers.indexOf('ReviewBody'),
    ReviewValueOrQualityNum1: headers.indexOf('ReviewValueOrQualityNum1'),
    ReviewValueOrQualityText1: headers.indexOf('ReviewValueOrQualityText1'),
    ReviewValueOrQualityNum2: headers.indexOf('ReviewValueOrQualityNum2'),
    ReviewValueOrQualityText2: headers.indexOf('ReviewValueOrQualityText2'),
    ReviewTime: headers.indexOf('ReviewTime'),
    RecommendationStatus: headers.indexOf('RecommendationStatus'),
    createdAt: headers.indexOf('createdAt'),
    updatedAt: headers.indexOf('updatedAt'),

  };

  // Iterate through rows and insert data into Sequelize
  for (let i = 1; i < rows.length; i++) {
    const columns = rows[i].split(',');

    // Extract only the required columns
    const ReviewDataToInsert = {
      ProductID: columns[columnIndex.ProductID],
      ReviewHeading: columns[columnIndex.ReviewHeading],
      ReviewBody: columns[columnIndex.ReviewBody],
      ReviewValueOrQualityNum1: columns[columnIndex.ReviewValueOrQualityNum1] === '' ? null : parseFloat(columns[columnIndex.ReviewValueOrQualityNum1]),
      ReviewValueOrQualityText1: columns[columnIndex.ReviewValueOrQualityText1],
      ReviewValueOrQualityNum2: columns[columnIndex.ReviewValueOrQualityNum2] === '' ? null : parseFloat(columns[columnIndex.ReviewValueOrQualityNum2]),
      ReviewValueOrQualityText2: columns[columnIndex.ReviewValueOrQualityText2],
      ReviewTime: columns[columnIndex.ReviewTime],
      RecommendationStatus: columns[columnIndex.RecommendationStatus],
      createdAt: columns[columnIndex.createdAt],
      updatedAt: columns[columnIndex.updatedAt],

    };
    
    // const ProductDataToInsert = {

    // };

    try {
      // Use the create method to insert data into the database
      await ReviewsData.create(ReviewDataToInsert);
      console.log('Data inserted into Sequelize');
    } catch (error) {
      console.error('Error inserting data into Sequelize: ', error);
    }
  }

  //search up how to put csvData in db table -> in progress

  res.redirect("/");

  // return res.send('file uploaded.');
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});