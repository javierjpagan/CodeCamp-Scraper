// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var SaveSchema = new Schema({
  // title is a required string
  title: {
    type: String,
    required: true
  },
  // link is a required string
  link: {
    type: String,
    required: true
  },
  // This only saves one comment's ObjectId, ref refers to the Comment model
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});

// Create the Save model with the SaveSchema
var Save = mongoose.model("Save", SaveSchema);

// Export the model
module.exports = Save;
