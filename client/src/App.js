import {useEffect, useState} from "react";
import {BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom'
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
import Game from "./components/pages/Game";
import Loading from "./components/layout/Loading";
import {toggleLoading} from "./redux/app/appSlice";



const App= ()=>{
    const dispatch=useDispatch();
    const navigate= useNavigate()
    const{gaming}= useSelector((state)=>state.app)
    const{ user }= useSelector((state)=>
        state.auth)
    const {loading}=useSelector((state)=>
        state.app)

    useEffect(() => {
        dispatch(authenticate({}));
        if(user){
            navigate('/menu')
        }
        setTimeout(()=>{
            dispatch(toggleLoading())
        },1000)
    }, []);
    return(
        <>
            {loading?(<Loading loading={loading}/> ): !gaming?(
                <Layout>
                 <Routes>
                  <Route path='/' element={<Landing/>} />
                  <Route path='/login' element={<Login/>} />
                  <Route path='/register' element={<Register/>} />
                  <Route path='/menu' element={<MainMenu/>} />
                  <Route path="*" element={<Error404/>} />
                  </Routes>
                  <ToastContainer />
                </Layout>
                ):(
                <Routes>
                  <Route path='/game' element={<Game/>} />
                </Routes>)
            }
        </>
    );
}

const AppContainer=()=>(

        <Router>
                <App/>
        </Router>

    )


export default AppContainer;
