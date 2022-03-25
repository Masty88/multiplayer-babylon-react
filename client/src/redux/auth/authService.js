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

//Login user
const authenticate = async (token)=>{
    const config = {
        headers: {
            'x-auth-token': token,
        },
    }

    const response= await axios.get(API_URL_AUTH, config);
    return response.data
}


//Logout user
const logout=async(token)=>{
    const config={
        headers: {
            'x-auth-token': token,
        },
    }
    const response= await axios.get('api/auth/logout', config);
    if(response.data){
        localStorage.removeItem('user')
    }
    return response.data
}

const authService={
    register,
    logout,
    login,
    authenticate
}

export  default authService;
