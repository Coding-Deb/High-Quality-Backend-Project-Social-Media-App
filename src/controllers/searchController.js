import handleError from "../middleware/error.middleware.js";
import { User } from "../models/user.model.js";

// TODO: SEARCH QUERY EDIT....
export const searchData = async (req, res) => {
  try {
    const { query } = req.params;
    const userData = [];

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    });

    // console.log(users);
   
    userData.push(...users.map(item => item.email)); // Push usernames into userData array

    res.status(200).json({
      status: true,
      message: "Users Found",
      userData, // Return the entire userData array
    });

  } catch (error) {
    handleError(error, req, res);
  }
};
