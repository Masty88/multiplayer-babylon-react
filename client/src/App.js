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
import {useSelector} from "react-redux";


const App= ()=>{
    const { loading} = useSelector(state => state.app);
    console.log(loading)
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
    <Router>
        <Layout>
            <App/>
        </Layout>
    </Router>
    )


export default AppContainer;
