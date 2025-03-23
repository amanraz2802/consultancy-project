import axios from "axios";
import toast from "react-hot-toast";

export const authenticateWithGoogle = async (token) => {
  try {
    // console.log(token);
    const baseURL = import.meta.env.VITE_API_BASE_URL;

    const response = await axios.post(
      `${baseURL}/auth/login`,
      {}, // Request body (empty object in this case)
      {
        headers: {
          Authorization: `Bearer ${token}`, // Correct way to set Authorization header
        },
      }
    );

    return response;
  } catch (error) {
    toast.error(error.response.data.error);
    throw new Error("Error authenticating with Google: " + error.message);
  }
};
