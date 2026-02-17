import axios from "axios";

export const axiosInterceptos = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
})

axiosInterceptos.interceptors.request.use(
    function(x) {
        if(localStorage.getItem('token')) x.headers.token = localStorage.getItem('token')
            return x
    },
    function(error) {
        console.log(error)
    }
)

axiosInterceptos.interceptors.response.use(
    function(response) {
        return response
    }
    , function(error) {
        console.log(error)
    }
)