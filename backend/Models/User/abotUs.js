import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
  keys: [
    {
      keywords: {
        type: String,
        required: [true, "Keywords is required"],
        trim: true,
        minLength: [2, "Keywords must have atleast 2 characters."],
        maxLength: [50, "Keywords must not exceeds 50 characters."],
        match: [
          /^[a-zA-Z0-9\s\-_,.]+$/,
          "Keyword contains invalid characters.",
        ],
      },
    },
  ],
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    minLength: [20, "Description should have atleast 20 characters"],
    maxLength: [5000, "Description should not increase 5000 characters"],
  },
});

const About = mongoose.model("About", aboutSchema);

export default About;
