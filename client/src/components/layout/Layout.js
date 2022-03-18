import { useSelector, useDispatch } from "react-redux";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputIcon from '@mui/icons-material/Input';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { logout, reset } from "../../redux/auth/authSlice";
import {useLocation, useNavigate} from "react-router-dom";
import {Link} from "react-router-dom";
import {CssBaseline} from "@mui/material";
import React, {useEffect} from "react";
import {resetProfile} from "../../redux/profile/profileSlice";
import {toggleGaming, toggleLoading} from "../../redux/app/appSlice";
import Loading from "./Loading";


const Layout = ({children})=>{
    const navigate = useNavigate();
    const dispatch= useDispatch();
    const location= useLocation()

    const {user}= useSelector((state)=>
        state.auth
    );

    useEffect(()=>{
        if(!user){
            navigate('/')
            dispatch(toggleGaming(false))
        }
    },[user])

    const onLogout = () => {
        dispatch(logout())
        dispatch(reset())
        dispatch(resetProfile())
        navigate('/')
    }

    return(
        <>
            <AppBar position="static">
                <Toolbar sx={{
                    display: 'flex', justifyContent: 'space-between', alignItems: ' center' }}>
                    <Typography variant="h5" component="h1">Mediverse</Typography>
                    <Box>
                        {user ?
                            (<IconButton onClick={onLogout}>
                            <LogoutIcon/>
                            </IconButton>)
                            : (
                                <>
                                <Link to='/login'>
                                    <IconButton>
                                            <InputIcon sx={{ color: "white"}}/>
                                    </IconButton>
                                </Link>
                                <Link to='/register'>
                                    <IconButton>
                                            <PersonAddAltIcon sx={{ color: "white" }}/>
                                    </IconButton>
                                </Link>
                                </>

                            )}
                    </Box>
                </Toolbar>
            </AppBar>
            <Container sx={{flexGrow: 1, minHeight: "90vh",display:"flex", justifyContent:"center", alignItems: "center"}}>
             {children}
             </Container>
           </>
            )
};

export default Layout
