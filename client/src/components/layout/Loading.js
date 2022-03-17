import {Box, CircularProgress, LinearProgress} from "@mui/material";


const Loading = ({loading}) => (
    <>
        {loading?(
            <Box sx={{  position: 'fixed',
                top: 0, bottom: 0,
                left:0, right: 0,
                display:'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background:'rgb(0,0,0)',
                backdropFilter: 'blur(10px)',
                transition: 'opacity 0.2s ease-in-out'}}
            >
                <CircularProgress sx={{width:320}}/>
            </Box>
        ):null}
    </>
);


export default Loading;
