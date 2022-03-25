import React, {useEffect, useRef, useState} from 'react';
import {
    Avatar,
    Box,
    Button,
    Card, CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    createTheme,
    Grid,
} from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import LoadingButton from "@mui/lab/LoadingButton";
import {createProfile, resetProfile} from "../../redux/profile/profileSlice";
import CardPlayer from "./CardPlayer";


const cards=[
    {
        id:1,
        path: "avatar/liz_vid.webm?autoplay=1&mute",
        mesh:"liz.glb"
    },
    {
        id:2,
        path: "avatar/magda_vid.webm?autoplay=1&mute",
        mesh: "magda.glb"
    },
    {
        id:3,
        path: "avatar/tony_vid.webm?autoplay=1&mute",
        mesh: "tony.glb"
    }
]

const CreateProfile = (props) => {
    const[mesh, setMesh]= useState("");
    const [isSelected, setSelected] = useState("");
    const dispatch= useDispatch()


    const navigate= useNavigate();

    const{ profile,isLoading, isError, isSuccess, message }= useSelector((state)=>
        state.profile)

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }

        if (isSuccess || profile) {
            navigate('/menu')
        }

        dispatch(resetProfile())
    }, [profile, isError, isSuccess, message, navigate, dispatch])


    const handleSubmit=(e)=>{
        e.preventDefault();
        const profileData={
            mesh,
        }
        dispatch(createProfile({profile:profileData}))
    }

    const handleClick=(card,index)=>{
        setMesh(card.mesh)
        setSelected(index)
    }

    return (
        <Container component="main">
                <Box component="form" onSubmit={handleSubmit} sx={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                    <Grid container spacing={8}>
                        {cards.map((card,index) => (
                            <Grid item key={card.id} xs={12} md={4}>
                             <CardPlayer path={card.path} selected={isSelected == index} onChange={()=>handleClick(card,index)} />
                            </Grid>
                        ))}
                    </Grid>

                    <Grid container spacing={8} sx={{marginTop: "80px"}}>
                        <Grid item xs={4} md={4}></Grid>
                        <Grid item xs={4} md={4}></Grid>
                        <Grid item xs={4} md={4}>
                            <LoadingButton variant="contained"
                                           type="submit"
                                           loading={isLoading}
                                           fullWidth>
                                Play</LoadingButton>
                        </Grid>
                    </Grid>
                </Box>
        </Container>
    );
};

export default CreateProfile;
