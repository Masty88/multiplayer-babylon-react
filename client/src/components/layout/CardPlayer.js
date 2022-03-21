import React, {useEffect, useState} from 'react';
import {makeStyles} from "@mui/styles";
import {Card, CardActionArea, CardMedia, Grid} from "@mui/material";

const useStyles= makeStyles({
    root:{
        border:"solid 5px green"
    }
})

const CardPlayer = ({path,selected,onChange}) => {
    const classes= useStyles()

    return (

            <Card
                className={selected ? classes.root : "" }
                sx={{ width:"100%", height:"100%", display: 'flex', flexDirection: 'column' }}
                >
                <CardActionArea
                    onClick={onChange}
                >
                    <CardMedia
                        component="video"
                        image= {path}
                        alt="avatar video"
                         sx={{
                             width:"220%",
                             height:"100%",
                             position:"relative",
                             left:"-55%"
                         }}

                        autoPlay
                        muted
                        loop
                    />
                </CardActionArea>
            </Card>
    );
};

export default CardPlayer;
