import React, {useEffect, useRef, useState} from 'react';
import {Avatar, Box, Button, Card, CardActions, CardContent, CardMedia, createTheme, Grid} from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";

import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import {createProfile, resetProfile} from "../../redux/profile/profileSlice";

const CreateProfile = () => {
    const[mesh, setMesh]= useState("");

    const navigate= useNavigate();
    const dispatch= useDispatch();

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
                <Box component="form"  onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>

                        <Grid item xs={12} >
                            <TextField
                                label="mesh"
                                fullWidth
                                value={mesh}
                                onChange={e=> setMesh(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <LoadingButton variant="contained"
                                           type="submit"
                                           loading={isLoading}
                                           disabled={ mesh.trim().length=== 0}
                                           fullWidth
                            >
                                Register</LoadingButton>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>

    // const [avatar, setAvatar]= useState(null)
    // const disableButton = () =>{
    //     if(!avatar){
    //         return true; // this disables the button
    //     }else {
    //         return  false; // this disables the button
    //     }
    // }
    // return (
    //     <>
    //         <Container sx={{ py: 8 }} maxWidth="md">
    //             {/* End hero unit */}
    //             <Grid container spacing={4}>
    //                     <Grid item  xs={12}  md={4}>
    //                         <Card
    //                             sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}
    //                             onClick={()=>setAvatar(true)}
    //                         >
    //                             <CardMedia
    //                                 component="img"
    //                                 image="https://source.unsplash.com/random"
    //                                 alt="random"
    //                             />
    //                             <CardContent sx={{ flexGrow: 1 }}>
    //                                 <Typography gutterBottom variant="h5" component="h2">
    //                                     Heading
    //                                 </Typography>
    //                                 <Typography>
    //                                     This is a media card. You can use this section to describe the
    //                                     content.
    //                                 </Typography>
    //                             </CardContent>
    //                             <CardActions>
    //                                 <Button size="small">Choose</Button>
    //                             </CardActions>
    //                         </Card>
    //                     </Grid>
    //             </Grid>
    //             <Button size="small"
    //                     variant="contained"
    //                     disabled={avatar == null}
    //                     onClick={() =>console.log("you choose")}
    //             >GO TO GAME</Button>
    //         </Container>
    //     </>>
    );
};

export default CreateProfile;
