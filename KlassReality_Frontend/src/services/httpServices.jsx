import axios from "axios";

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API_URL}`,
  timeout: 500000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

// Add a request interceptor
instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  const token = JSON.parse(localStorage.getItem("accessToken"));
  return {
    ...config,
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${token}`,
    },
  };
});
const responseBody = (response) => response.data;

const requests = {
  get: (url, body) => instance.get(url, body).then(responseBody),

  post: (url, body, headers) =>
    instance.post(url, body, headers).then(responseBody),

  put: (url, body) => instance.put(url, body).then(responseBody),
  patch: (url, body) => instance.patch(url, body).then(responseBody),
  delete: (url, body) => instance.delete(url, body).then(responseBody),
};

export default requests;
