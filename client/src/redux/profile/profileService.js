import axios from 'axios'

const API_URL='api/profile/'
const API_URL_ME='api/profile/me'


//Register user
const createProfile = async (profileData, token)=>{
    const config = {
        headers: {
            'x-auth-token': token,
        },
    }
    console.log(config)

    const response= await axios.post(API_URL, profileData, config);
    return response.data
};

const getProfile=async (token)=>{
    const config = {
        headers: {
            'x-auth-token': token,
        },
    }

    const response= await axios.get(API_URL_ME, config);
    return response.data
};


const profileService={
    createProfile,
    getProfile
}

export  default profileService;
