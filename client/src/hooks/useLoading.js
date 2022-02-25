import {useState, useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import {toggleLoading} from "../redux/app/appSlice";

const useLoading=()=>{
    const dispatch = useDispatch()

    useEffect(()=>{
        setTimeout(()=>{
            dispatch(toggleLoading(false))
        },1000)
    },[])

}

export default useLoading;
