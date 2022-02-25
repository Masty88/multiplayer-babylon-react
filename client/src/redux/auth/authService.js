import axios from 'axios'

const API_URL='api/users/'
const API_URL_AUTH='api/auth/'

//Register user
const register = async (userData)=>{
    const response= await axios.post(API_URL, userData);

    if(response.data){
        localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
}

//Login user
const login = async (userData)=>{
    const response= await axios.post(API_URL_AUTH, userData);

    if(response.data){
        localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
}

//Logout user
const logout=()=>{
    localStorage.removeItem('user')
}

const authService={
    register,
    logout,
    login
}

export  default authService;