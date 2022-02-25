import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from "react-redux";
import {useNavigate} from 'react-router-dom'
import { toast } from "react-toastify";
import{ register, reset } from "../../redux/auth/authSlice";

import Paper from "@mui/material/Paper";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {Avatar, Box, Button, Container, createTheme, CssBaseline, Grid} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {ThemeProvider} from "@emotion/react";
import Loading from "../layout/Loading";



const Register = () => {
    const[username,setUsername]= useState("");
    const[password, setPassword]= useState("");
    const[password2, setPassword2]= useState("");
    const[email, setEmail]= useState("");

    const theme = createTheme();

    const navigate= useNavigate();
    const dispatch= useDispatch();

    const{ user,isLoading, isError, isSuccess, message }= useSelector((state)=>
        state.auth)

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }

        if (isSuccess || user) {
            navigate('/main')
        }

        dispatch(reset())
    }, [user, isError, isSuccess, message, navigate, dispatch])

    const handleSubmit=(e)=>{
        e.preventDefault();
        if (password !== password2) {
            toast.error('Password do not match')
        }else{
            const userData={
                username,
                email,
                password
            }
            dispatch(register({user:userData}))
        }
    }

    if(isLoading){
        return <Loading/>
    }

    return (
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form"  onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>

                            <Grid item xs={12} >
                                <TextField
                                    label="Username"
                                    fullWidth
                                    value={username}
                                    onChange={e=> setUsername(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12} >
                                <TextField
                                    label="email"
                                    fullWidth
                                    value={email}
                                    onChange={e=> setEmail(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12} >
                                <TextField
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    value={password}
                                    onChange={e=> setPassword(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12} >
                                <TextField
                                    label="Repeat Password"
                                    type="password"
                                    fullWidth
                                    value={password2}
                                    onChange={e=> setPassword2(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <LoadingButton variant="contained"
                                        type="submit"
                                        loading={isLoading}
                                        disabled={username.trim().length === 0 || password.trim().length=== 0 || email.trim().length=== 0}
                                        fullWidth
                                >
                                    Register</LoadingButton>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
    );
};

export default Register;

