import { axios } from "src/boot/axios";


const userLogin = async (email, password, device) => {
  return await handleRequest("post", "/api/people/login", {
    email,
    password,
    device,
  });
};
const handleRequest = async (method, endPoint, data) => {
  try {
    if (typeof data == "undefined") {
      return await axios.json[method](endPoint);
    } else {
      return await axios.json[method](endPoint, data);
    }
  } catch (error) {
    handleError(error, endPoint);
    return false;
  }
};

export default {
  userLogin,
};
