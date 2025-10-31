
import mongoose from "mongoose";

const userNoteSchema = new mongoose.Schema(
  {
    note: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const UserNoteModel = mongoose.model("Note", userNoteSchema);

export default UserNoteModel;

