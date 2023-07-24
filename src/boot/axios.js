import Axios from "axios";
import _ from "lodash";

/* demo for jsonapi sandbox */
const token = "CqgsHhdXz4grX7a1hUKjVZETDLlaFFaw4UQaPXeaU-E";
export const sandboxConfig = {
  baseURL: "https://sandbox.howtojsonapi.com/",
  headers: {
    "Content-Type": "application/vnd.api+json",
    Accept: "application/vnd.api+json",
    Authorization: `Bearer ${token}`,
  },
};

/* use for interacting with standard JSONAPI end-points */
export const jsonApiConf = {
  withCredentials: true,
  timeout: 10000,
  // httpsAgent: new https.Agent({
  //   rejectUnauthorized: false
  // }),
  baseURL: process.env.SRV,
  headers: {
    // "Access-Control-Allow-Origin": "*", // @deprecated this causes CORS errors
    "Content-Type": "application/vnd.api+json",
    Accept: "application/vnd.api+json",
  },
};
export const reststateConf = {
  withCredentials: true,
  timeout: 10000,
  // httpsAgent: new https.Agent({
  //   rejectUnauthorized: false
  // }),
  baseURL: process.env.SRV + "/api",
  headers: {
    // "Access-Control-Allow-Origin": "*", // @deprecated this causes CORS errors
    "Content-Type": "application/vnd.api+json",
    Accept: "application/vnd.api+json",
  },
};

/* use for interacting with custom / standard JSON end-points */
export const jsonConf = {
  withCredentials: true,
  timeout: 10000,
  // httpsAgent: new https.Agent({
  //   rejectUnauthorized: false
  // }),
  baseURL: process.env.SRV,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

/* use for PDF generation */
export const imageConfig = {
  responseType: "blob",
};

// export const config = {
//   withCredentials: true,
//   timeout: 10000,
//   httpsAgent: new https.Agent({
//     rejectUnauthorized: false
//   }),
//   baseURL: process.env.SRV + "/api",
//   headers: {
//     // "Access-Control-Allow-Origin": "*", // @deprecated this causes CORS errors
//     // "Content-Type": "application/json",
//     "Content-Type": "application/vnd.api+json",
//     Accept: "application/vnd.api+json"
//     // Cookie: "source=device; version=0.0.9"  // @todo: error: refused to set usafe cookie
//   }
//   // httpsAgent: new https.Agent({
//   //   ca: fs.readFileSync("./resource/bundle.crt"),
//   //   cert: fs.readFileSync("./resrouce/thirdparty.crt"),
//   //   key: fs.readFileSync("./resource/key.pem")
//   // })
// };

// export const coinbaseConfig = {
//   baseURL: "https://api.coindesk.com/v1/bpi/",
//   timeout: 1000
//   // headers: { "X-Custom-Header": "foobar" }
// };

// export const pingConfig = {
//   withCredentials: true,
//   timeout: 10000,
//   httpsAgent: new https.Agent({
//     rejectUnauthorized: false
//   }),
//   baseURL: process.env.SRV + "/api",
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json"
//   }
// };
// export const schemaConfig = {
//   withCredentials: true,
//   timeout: 5000,
//   httpsAgent: new https.Agent({
//     rejectUnauthorized: false
//   }),
//   baseURL: process.env.SRV + "/",
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json"
//   }
// };
// export const baseConfig = {
//   withCredentials: true,
//   timeout: 1000,
//   httpsAgent: new https.Agent({
//     rejectUnauthorized: false
//   }),
//   baseURL: process.env.SRV,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json"
//   }
// };

// const authConfig = {
//   withCredentials: true,
//   timeout: 50000,
//   httpsAgent: new https.Agent({
//     rejectUnauthorized: false
//   }),
//   baseURL: process.env.SRV,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json"
//   }
// };

// const instance = axios.create(config);

// export { instance };

// export const coinbase = axios.create(coinbaseConfig);
// export const ping = axios.create(pingConfig);
// export const schema = axios.create(schemaConfig);
// export const image = axios.create(imageConfig);
// // export const howtojson = axios.create((sandboxConfig));
// export const howtojson = axios.create(config);
// export const api = axios.create(config);
// export const authApi = axios.create(authConfig);

// export const srv = axios.create(_.cloneDeep(baseConfig));

export const json = Axios.create(jsonConf);
export const jsonApi = Axios.create(jsonApiConf);
export const image = Axios.create(imageConfig);
export const reststate = Axios.create(reststateConf);
export const axios = { json, jsonApi, image, reststate };

/** Catch 401 errors and redirect the user to login */
// axios.jsonApi.interceptors.request.use(
//   (config) => {
//     // console.log(config);
//     return config;
//   },
//   function (error) {
//     // console.log("axios interceptor");
//     // console.log(error);
//     // console.log(error.response);
//   }
// );

// @todo: this is hacky middleware to address this issue: https://github.com/FriendsOfCake/crud-json-api/issues/126
// @deprecated: why bother? Instead just don't include `/api` in the baseURL. Simpler
// axios.json.interceptors.request.use(
//   config => {
//     if (config.url.includes("api/")) {
//       config.url = config.url.replace("/api/", "/");
//     }
//     return config;
//   }
//   // function(error) {
//   //   // Any status codes that falls outside the range of 2xx cause this function to trigger
//   //   // Do something with response error
//   //   return Promise.reject(error);
//   // }
// );
// axios.jsonApi.interceptors.request.use(config => {
//   if (config.url.includes("api/")) {
//     config.url = config.url.replace("/api/", "/");
//   }
//   return config;
// });

// axios.image.interceptors.request.use(config => {
//   if (config.url.includes("api/")) {
//     config.url = config.url.replace("/api/", "/");
//   }
//   return config;
// });

/**
 * default allows all to be imported and then dynamically selected via a string variable
 */
export default {
  axios,
};
