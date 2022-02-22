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
import { logout, reset } from "../../redux/authSlice";
import {useNavigate} from "react-router-dom";
import {Link} from "react-router-dom";

const Layout = ({children})=>{
    const navigate = useNavigate();
    const dispatch= useDispatch();
    const {user}= useSelector((state)=>
        state.auth
    );
    const onLogout = () => {
        dispatch(logout())
        dispatch(reset())
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
                             <IconButton>
                                <Link to='/login'>
                                    <InputIcon sx={{ color: "white", marginRight: "15px" }}/>
                                </Link>
                                 <Link to='/register'>
                                     <PersonAddAltIcon sx={{ color: "white" }}/>
                                 </Link>
                             </IconButton>
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
