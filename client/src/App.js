import {useEffect, useState} from "react";
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import Login from "./components/pages/Login";
import Landing from "./components/pages/Landing";
import Register from "./components/pages/Register";
import MainMenu from "./components/pages/MainMenu";
import Layout from "./components/layout/Layout";
import Error404 from "./components/pages/Error404";
import {useDispatch, useSelector} from "react-redux";
import {authenticate} from "./redux/auth/authSlice";
import {WebSocketProvider} from "./WebSocketProvider";


const App= ()=>{
    const dispatch=useDispatch();

    useEffect(() => {
        dispatch(authenticate({}));
        console.log("auth")
    }, []);
    console.log(JSON.parse(localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN))['token'])

    return(
        <>
            <Routes>
                <Route path='/' element={<Landing/>} />
                <Route path='/login' element={<Login/>} />
                <Route path='/register' element={<Register/>} />
                <Route path='/menu' element={<MainMenu/>} />
                <Route path="*" element={<Error404/>} />
            </Routes>
            <ToastContainer />
        </>
    );
}

const AppContainer=()=>(
    <WebSocketProvider
        url={process.env.REACT_APP_API_URL}
        token={JSON.parse(localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN))['token']}
    >
        <Router>
            <Layout>
                <App/>
            </Layout>
        </Router>
    </WebSocketProvider>

    )


export default AppContainer;
