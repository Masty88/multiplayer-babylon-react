import React, {useEffect, useState} from 'react';
import {makeStyles} from "@mui/styles";
import {Card, CardActionArea, CardMedia, Grid} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {toggleSelected} from "../../redux/app/appSlice";



const useStyles= makeStyles({
    root:{
        backgroundColor: "blue"
    }
})

const CardPlayer = ({path,selected, onChange}) => {
    const classes= useStyles()
    const [isSelected, setIsSelected]= useState(false)

    // useEffect(()=> {
    //     if (selected) {
    //         setIsSelected(!isSelected)
    //         console.log("run")
    //     }
    // },[selected])

    // const handleClick=()=>{
    //     setIsSelected(!isSelected)
    //     // if(selected){
    //     //     setIsSelected(false)
    //     // }
    // }

    return (
            <Card
                className={selected ? classes.root : "" }
                sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}
                >
                <CardActionArea
                    onClick={onChange}
                >
                    <CardMedia
                        component="img"
                        image= {path}
                        alt="random"
                        sx={{width:"310px", height:"450px"}}
                    />
                </CardActionArea>
            </Card>
    );
};

export default CardPlayer;
