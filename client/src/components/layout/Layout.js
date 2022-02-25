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
import {useNavigate} from "react-router-dom";
import {Link} from "react-router-dom";
import {CssBaseline} from "@mui/material";
import React, {useEffect} from "react";
import {resetProfile} from "../../redux/profile/profileSlice";
import {toggleLoading} from "../../redux/app/appSlice";
import Loading from "./Loading";
import useLoading from "../../hooks/useLoading";

const Layout = ({children})=>{
    const navigate = useNavigate();
    const dispatch= useDispatch();

    const {user}= useSelector((state)=>
        state.auth
    );

    const {loading}= useSelector(state=>state.app);

    const onLogout = () => {
        dispatch(logout())
        dispatch(reset())
        dispatch(resetProfile())
        navigate('/')
    }

    useLoading()

    if(loading)return <Loading active={loading}/>

    return(
        <>
            <CssBaseline />
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
                                    <IconButton>
                                        <Link to='/login'>
                                            <InputIcon sx={{ color: "white", marginRight: "15px" }}/>
                                        </Link>
                                    </IconButton>
                                    <IconButton>
                                        <Link to='/register'>
                                            <PersonAddAltIcon sx={{ color: "white" }}/>
                                        </Link>
                                    </IconButton>
                                </>

                            )}
                    </Box>
                </Toolbar>
            </AppBar>
            <Container sx={{flexGrow: 1}}>
             {children}
             </Container>
           </>
            )
};

export default Layout
