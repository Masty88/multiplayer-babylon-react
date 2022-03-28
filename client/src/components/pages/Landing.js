import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {reset} from "../../redux/auth/authSlice";
import {Box, Button, Card, CardMedia, Typography} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";


const Landing = () => {
    const navigate= useNavigate();
    const dispatch= useDispatch();

    const{ user, isError, isSuccess, message }= useSelector((state)=>
        state.auth)

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }
        if (isSuccess || user) {
            navigate('/menu')
        }
        dispatch(reset())
    }, [user, isError, isSuccess, message, navigate, dispatch])


    return (
        <>
            <Card sx={{
                minWidth:"100%",
                minHeight:"100%",
                position:"absolute",
                zIndex:-1,
                top:0,
            }}>
               <CardMedia
                   component="video"
                   image= "avatar/pres_game.webm?autoplay=1&mute"
                   alt="avatar video"
                   sx={{
                       minWidth:"100%",
                       minHeight:"100%",
                       position: "fixed",
                       opacity:"0.4",
                       right:0,
                       left:0
                   }}
                   autoPlay
                   muted
                   loop
               />
            </Card>
            <Box sx={{
                width:"100%",
                height:"100%",
                display: "flex",
                flexDirection:"column",
                justifyContent:"flex-end"
            }}>
                <Typography variant="h1" sx={{marginBottom:"35px"}} sm={{fontSize:"5px"}}>
                    Welcome to MyVerse
                </Typography>
                <Typography variant="h5" sx={{marginBottom:"35px"}} style={{fontWeight:100}}>
                    Explore and trade in the first-ever virtual world owned by its users.
                </Typography>
                <Link style={{ textDecoration: 'none' }}  to='/register'>
                <Button variant="contained" sx={{maxWidth:"250px",minHeight:"3em", width:"calc(50% - 1em)", marginBottom:"45vh", fontSize:"18px", color:"white"}}>
                    GET STARTED
                </Button>
                </Link>
            </Box>
        </>
    );
};

export default Landing;
