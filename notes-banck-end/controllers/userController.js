import UserModel from "../models/user-schema.js";
import UserNoteModel from "../models/notes-schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


 const registerUser = async (request, response) => {
  try {
    const { name, email, password } = request.body;

    
    if (!name || !email || !password) {
      return response.json({
        message: "Required fields are missing!",
        status: false,
      });
    }
 

    const user = await UserModel.findOne({ email });
     
    console.log("user", user);
    
    if (user) {
      return response.json({
        message: "Email address already exists!",
        status: false,
      });
    }

    
    const hashPass = await bcrypt.hash(password, 10);

    
    const userObj = {
      ...request.body,
      password: hashPass,
    };

    await UserModel.create(userObj);

    // ✅ 5. Success response
    response.json({
      message: "User successfully signed up!",
      status: true,
    });

  } catch (error) {
    // ✅ 6. Catch errors safely
    response.json({
      message: error.message || "Something went wrong",
      status: false,
    });
  }
};

const loginUser = async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.json({
        message: "Required fields are missing",
        status: false,
      });
    }

    const user = await UserModel.findOne({ email });
    console.log("🔍 Found user:", user);

    if (!user) {
      return response.json({
        message: "Invalid email or password",
        status: false,
      });
    }

    const comparePass = await bcrypt.compare(password, user.password);
    console.log("🔑 Password match:", comparePass);

    if (!comparePass) {
      return response.json({
        message: "Invalid email or password",
        status: false,
      });
    }

    const data = { _id: user._id };
    const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "1h" });

    return response.json({
      message: "User Login Successfully!",
      status: true,
      token,
      user: { _id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    response.json({
      message: error.message || "Something went wrong",
      status: false,
    });
  }
};
 

// 🧠 Create Note
 const createNotes = async (request, response) => {
  try {
    const { note } = request.body;
    const userId = request.user._id; 

    const createPost = await UserNoteModel.create({ note, userId });

    return response.json({
      message: "Post Successfully Created!",
      createPost,
    });
  } catch (error) {
    response.json({
      message: error.message || "Something went wrong",
    });
  }
};

// 📋 Get all notes for the logged-in user
const getMyNotes = async (request, response) => {
  try {
    const userId = request.user._id; 
    const notes = await UserNoteModel.find({ userId }).sort({ createdAt: -1 });

    return response.json({ notes });
  } catch (error) {
    response.status(500).json({
      message: error.message || "Failed to fetch notes",
    });
  }
};



export { registerUser, loginUser, createNotes, getMyNotes };
