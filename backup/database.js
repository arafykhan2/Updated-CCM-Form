const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  'alrahim_textile_rev_db',
  'root',
  '123',
  {
    host: 'localhost',
    dialect: 'mysql'
  }
);

const PDTData = sequelize.define("pdt_data", {

  pdt_upc: {
    type: DataTypes.STRING,
  },

  pdt_name: {
    type: DataTypes.STRING,
  },
  
  pdt_price: {
    type: DataTypes.FLOAT,
  },

  pdt_rating_stars_avg: {
    type: DataTypes.FLOAT,
  },

  pdt_no_of_ratings: {
    type: DataTypes.INTEGER,
  },

  pdt_no_of_recommendations: {
    type: DataTypes.INTEGER,
  },

  pdt_quality_outof5: {
    type: DataTypes.FLOAT,
  },

  pdt_value_outof5: {
    type: DataTypes.FLOAT,
  },

  pdt_review_heading: {
    type: DataTypes.STRING,
  },

  pdt_review_text: {
    type: DataTypes.STRING,
  },

  pdt_review_recommendation: {
    type: DataTypes.STRING,
  },

  pdt_review_qov_outof5_no1: { type: DataTypes.INTEGER, }, pdt_review_qov_outof5_text1: { type: DataTypes.STRING, },

  pdt_review_qov_outof5_no2: { type: DataTypes.INTEGER, }, pdt_review_qov_outof5_text2: { type: DataTypes.STRING, },

  pdt_review_date: {
    type: DataTypes.DATE,
  },

});

const PDTSentimentScores = sequelize.define("pdt_sentiment_scores", {

  review_id : {
    type: DataTypes.INTEGER,
  },

  head_score: {
    type: DataTypes.INTEGER,
  },
  
  body_score: {
    type: DataTypes.INTEGER,
  },

  head_comparative: {
    type: DataTypes.FLOAT,
  },

  body_comparative: {
    type: DataTypes.FLOAT,
  },

  defects_keyword: {
    type: DataTypes.STRING,
  },

  sentiment: {
    type: DataTypes.STRING,
  },

  positive_words_head : {
    type: DataTypes.STRING,
  },

  negative_words_head: {
    type: DataTypes.STRING,
  },

  positive_words_body : {
    type: DataTypes.STRING,
  },

  negative_words_body : {
    type: DataTypes.STRING,
  }



});

const PDTSentimentCalculations = sequelize.define("pdt_sentiment_calculations", {

  sentiment_id: {
    type: DataTypes.INTEGER,
  },

  calculation_word: {
    type: DataTypes.STRING,
  },
  
  calculation_score: {
    type: DataTypes.INTEGER,
  },

  type: {
    type: DataTypes.FLOAT,
  },

});

const ProductData = sequelize.define("Products",{

  ProductUPC: {
    type: DataTypes.STRING,
  },

  ProductName: {
    type: DataTypes.STRING,
  },
  
  ProductPrice: {
    type: DataTypes.FLOAT,
  },

});

const ReviewsData =  sequelize.define("ProductReviews", {

  ProductID: {
    type: DataTypes.FLOAT,
  },

  ReviewHeading: {
    type: DataTypes.STRING,
  },

  ReviewBody: {
    type: DataTypes.STRING,
  },

  ReviewValueOrQualityNum1: {
    type: DataTypes.FLOAT,
    allowNull: true,

  },

  ReviewValueOrQualityText1: {
    type: DataTypes.STRING,
  },

  ReviewValueOrQualityNum2: {
    type: DataTypes.FLOAT,
    allowNull: true,

  },

  ReviewValueOrQualityText2: {
    type: DataTypes.STRING,
  },

  ReviewTime: {
    type: DataTypes.STRING,
  },

  RecommendationStatus: {
    type: DataTypes.STRING,
  },

});

const GeneralProductRatingData = sequelize.define("GeneralProductRating", {

  ProductID: {
    type: DataTypes.INTEGER
  },

  TotalQuality: {
    type: DataTypes.FLOAT
  },

  TotalValue: {
    type: DataTypes.FLOAT
  },

  TotalReviews: {
    type: DataTypes.INTEGER
  },

  PercentFiveStars: {
    type: DataTypes.INTEGER
  }, 

  PercentFourStars: {
    type: DataTypes.INTEGER
  }, 
  
  PercentThreeStars: {
    type: DataTypes.INTEGER
  }, 

  PercentTwoStars: {
    type: DataTypes.INTEGER
  }, 

  PercentOneStars: {
    type: DataTypes.INTEGER
  }, 

  TotalStars: {
    type: DataTypes.INTEGER
  }, 
  
  TotalStarsAverage: {
    type: DataTypes.FLOAT
  }, 

  TotalRecommendations: {
    type: DataTypes.INTEGER
  }, 

});

const DefectsData = sequelize.define("Defects", {

  ProductID: {
    type: DataTypes.INTEGER
  },

  ReviewID: {
    type: DataTypes.INTEGER
  },

  DefectCompany: {
    type: DataTypes.STRING
  },

  DefectKeyword: {
    type: DataTypes.STRING
  },
  
  DefectDescription: {
    type: DataTypes.STRING
  },

  DefectCategoryName: {
    type: DataTypes.STRING
  },

  DefectLevel: {
    type: DataTypes.STRING
  },
});

sequelize.sync().then(() => {
  console.log('Product Data table created successfully!');
}).catch((error) => {
  console.error('Unable to create table : ', error);
});

module.exports = {sequelize, PDTData, PDTSentimentScores, PDTSentimentCalculations, ProductData, ReviewsData, GeneralProductRatingData, DefectsData};