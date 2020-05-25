import { model, Schema, Model, Document } from "mongoose";
import Joi from "@hapi/joi";

const challengeSchema: Schema = new Schema({
  title: { type: String, required: true, unique: true },
  content: {
    problem: {
      type: String,
      default: "",
      required: true,
      trim: true,
    },
    constraints: {
      type: String,
      default: "",
      required: true,
      trim: true,
    },
    inputFormat: {
      type: String,
      default: "",
      required: true,
      trim: true,
    },
    outputFormat: {
      type: String,
      default: "",
      required: true,
      trim: true,
    },
  },
  level: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "easy",
    trim: true,
    set: (v: string) => v.toLowerCase(),
    get: (v: string) => v.toLowerCase(),
  },
  points: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  contest: {
    type: Schema.Types.ObjectId,
    ref: "Contest",
  },
  testCases: [
    {
      text: {
        type: String,
        default: "",
        required: true,
        trim: true,
      },
      testString: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],
  testInputs: {
    type: [String],
    required: true,
  },
  challengeSeed: {
    type: String,
    required: true,
    default: "",
    trim: true,
  },
});

interface IChallenge extends Document {
  title: String;
  content: String;
  level: String;
  points: Number;
  contest: String;
  testCases: [Object];
  testInputs: [String];
  challengeSeed: String;
}

const Challenge: Model<IChallenge> = model<IChallenge>(
  "Challenge",
  challengeSchema
);

const validateChallenge = (challenge: any) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    content: Joi.object({
      problem: Joi.string(),
      constraints: Joi.string(),
      inputFormat: Joi.string(),
      outputFormat: Joi.string(),
    }),
    level: Joi.string().required(),
    points: Joi.number().min(0),
    contestId: Joi.string().required(),
    testCases: Joi.array()
      .required()
      .items(
        Joi.object({
          text: Joi.string().required(),
          testString: Joi.string().required(),
        })
      ),
    testInputs: Joi.array().required(),
    challengeSeed: Joi.string(),
  });
  return schema.validate(challenge);
};

export { challengeSchema, Challenge, validateChallenge };
