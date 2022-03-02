import {Box, LinearProgress} from "@mui/material";


const Loading = () => (
    <Box sx={{  position: 'fixed',
        top: 0, bottom: 0,
        left:0, right: 0,
        display:'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background:'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(10px)',
        transition: 'opacity 0.2s ease-in-out'}}
    >
        <LinearProgress sx={{width:320}}/>
    </Box>
);


export default Loading;
