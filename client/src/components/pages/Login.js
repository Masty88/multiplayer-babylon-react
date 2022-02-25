import React, {useEffect, useState} from 'react';
import Paper from "@mui/material/Paper";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {Avatar, Box, Container, createTheme, CssBaseline, Grid} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {login, reset} from "../../redux/auth/authSlice";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {toggleLoading} from "../../redux/app/appSlice";
import Loading from "../layout/Loading";



const Login = () => {
    const[password, setPassword]= useState("");
    const[email, setEmail]= useState("");

    const navigate= useNavigate();
    const dispatch= useDispatch();

    const{ user,isLoading, isError, isSuccess, message }= useSelector((state)=>
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


    const handleSubmit=(e)=>{
        e.preventDefault();
        const userData={
                email,
                password
            }
        dispatch(login({user:userData}))
    }

    return (
        <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form"  onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>

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
                            <Grid item xs={12}>
                                <LoadingButton variant="contained"
                                               type="submit"
                                               loading={isLoading}
                                               disabled={ password.trim().length=== 0 || email.trim().length=== 0}
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

export default Login;
