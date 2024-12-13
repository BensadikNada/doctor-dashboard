import axios from "axios";




const axiosClient = axios.create({
   baseURL: `${import.meta.env.VITE_APP_BACKEND_URL}/api/`, 
   withCredentials: true,
   headers:{'Content-Type':'application/json'}
});



axiosClient.interceptors.response.use(response => {
   return response;
   }, error => {
      throw error;
   })


export default axiosClient;