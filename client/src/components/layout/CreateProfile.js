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
import {makeStyles} from "@mui/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";

import LoadingButton from "@mui/lab/LoadingButton";
import {createProfile, resetProfile} from "../../redux/profile/profileSlice";
import CardPlayer from "./CardPlayer";
import {toggleSelected} from "../../redux/app/appSlice";

const cards=[
    {
        id:1,
        path: "mypath1"
    },
    {
        id:2,
        path: "mypath2"
    },
    {
        id:3,
        path: "mypath3"
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
        setMesh(card.path)
        setSelected(index)
    }

    return (
        <Container component="main">
                <Box component="form" onSubmit={handleSubmit} >
                    <Grid container spacing={8}>
                        {cards.map((card,index) => (
                            <Grid item key={card.id} xs={12} md={4}>
                             <CardPlayer path={card.path} selected={isSelected === index} onChange={()=>handleClick(card,index)} />
                            </Grid>
                        ))}
                    </Grid>

                    <Grid container spacing={2} sx={{marginTop: "80px"}}>
                        <Grid item xs={4} md={4}></Grid>
                        <Grid item xs={4} md={4}></Grid>
                        <Grid item xs={4} md={4}>
                            <LoadingButton variant="contained"
                                           type="submit"
                                           loading={isLoading}
                                           fullWidth>
                                Register</LoadingButton>
                        </Grid>
                    </Grid>
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
