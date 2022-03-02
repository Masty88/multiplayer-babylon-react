import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {reset} from "../../redux/auth/authSlice";


const Landing = () => {
    const navigate= useNavigate();
    const dispatch= useDispatch();

    const{ user, isError, isSuccess, message }= useSelector((state)=>
        state.auth)

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }
        if (isSuccess || user) {
            navigate('/menu')
        }
        dispatch(reset())
    }, [user, isError, isSuccess, message, navigate, dispatch])


    return (
        <>
            <div>
                Welcome to Meta-verse
            </div>
        </>
    );
};

export default Landing;
