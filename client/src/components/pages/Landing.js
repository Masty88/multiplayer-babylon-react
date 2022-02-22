import React from 'react';
import {makeStyles} from "@mui/styles";
import AppBar from "@mui/material/AppBar";
import {Box, Button, Grid} from "@mui/material";
import Paper from "@mui/material/Paper";

const useStyle= makeStyles((theme)=>({
   appbar:{
       background: 'none'
   },
   appbarTitle:{
       flexGrow: '1'
   }
}))



const Landing = () => {
    const classes = useStyle()
    return (
        <div>
        </div>
    );
};

export default Landing;
