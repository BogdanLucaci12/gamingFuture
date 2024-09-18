import NavBar from "@/layout/navBar/NavBar.component"
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home.component";
import LoginPageAdmin from "./pages/login/LoginPageAdmin.component";
import ProtectedRouteEmployee from "./utils/ProtectedRouteEmployee.component";
import { useSelectored, useDispatcher } from "./store/hooks";
import { useEffect } from "react";
import Cookies from 'universal-cookie'
import { setCurrentUser, type Rank } from "./store/userSlice";
import LoginPageEmployee from "./pages/login/LoginPageEmployee.component";
import { useNavigate } from "react-router-dom";
import ProtectedRouteAdmin from "./utils/ProtectedRoutAdmin.component";
import AdminDashboard from "./pages/adminDashboard/AdminDashboard.component";
import { toast } from "react-toastify";

type Success={
  success:string,
  rank:Rank,
  name:string
}

type Error={
  error:string
}

type Data=Success | Error

const App = () => {
  const {isAuthenticated, rank}= useSelectored(state=>state.user);
  const cookies = new Cookies()
  const dispatch=useDispatcher()
  const navigate = useNavigate()
  
  useEffect(()=>{
    const fetchUser=async()=>{
      const response = await fetch('http://localhost:8626/admin/verifyToken', {
        method:'post',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      const data:Data=await response.json()
      if ("error" in data) {
        toast.error("Please log in")
        return cookies.set('token', '', { maxAge: 0 });
      }
      if ("success" in data) {
        const { name, rank } = data;
        console.log(data)
        dispatch(setCurrentUser({ name, isAuthenticated: true, rank }));
        navigate("/home")
        toast.success("Welcome")
      }
    }
    fetchUser()
  }, [])

  return (
    <Routes>
      <Route path="/" element={<NavBar />}>
        <Route path="/home" element={
          <ProtectedRouteEmployee 
          isAuthenticated={isAuthenticated}
          >
            <Home />
          </ProtectedRouteEmployee>
        }/>
        <Route path="admin-dashboard" element={
          <ProtectedRouteAdmin
            isAuthenticated={isAuthenticated}
            rank={rank}
          >
            <AdminDashboard />
          </ProtectedRouteAdmin>
        } />
       
        <Route path="/loginAdmin" element={<LoginPageAdmin />} />
        <Route path="/loginEmployee" element={<LoginPageEmployee />} />
      </Route>
    </Routes>
  )
}

export default App
