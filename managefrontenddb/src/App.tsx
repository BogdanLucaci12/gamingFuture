import NavBar from "@/layout/navBar/NavBar.component"
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home.page.tsx";
import LoginPageAdmin from "./pages/login/LoginPageAdmin.page.tsx";
import ProtectedRouteEmployee from "./utils/ProtectedRouteEmployee.component";
import { useSelectored, useDispatcher } from "./store/hooks";
import { useEffect } from "react";
import Cookies from 'universal-cookie'
import { setCurrentUser, setVerifyToken } from "./store/userSlice";
import LoginPageEmployee from "./pages/login/LoginPageEmployee.component.tsx";
import { useNavigate } from "react-router-dom";
import ProtectedRouteAdmin from "./utils/ProtectedRoutAdmin.component";
import AdminDashboard from "./pages/adminDashboard/AdminDashboard.page.tsx";
import { toast } from "react-toastify";
import AddProductPage from "./pages/addProduct/AddProductPage.page.tsx";
import ManageCategoriesAndBrands from "./pages/manageCategoriAndBrands/ManageCategoriesAndBrands.page.tsx";
import Settings from "./pages/settings/Settings.page.tsx";
import ChangeProduct from "./pages/changeProduct/ChangeProduct.page.tsx";
const App = () => {
  
  const { isAuthenticated, rank } = useSelectored(state => state.user);
  const cookies = new Cookies()
  const dispatch = useDispatcher()
  const navigate = useNavigate()


  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch('http://localhost:8626/employee/verifyToken', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      const data = await response.json()
      if (data.error) {
        toast.error("Please log in")
        // const setCookieHeader = data.headers.get('set-cookie');
        // if(!setCookieHeader){
        // }
        // cookies.set('token', '', { maxAge: 0 });
        navigate("/loginEmployee")
      }
      if (data.success) {
        const { name, rank } = data;
        console.log(data)
        dispatch(setCurrentUser({ name, isAuthenticated: true, rank }));
        navigate("/changeProduct")
        toast.success("Welcome")
      }
      dispatch(setVerifyToken(false))
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
        } />
        <Route path="admin-dashboard" element={
          <ProtectedRouteAdmin
            isAuthenticated={isAuthenticated}
            rank={rank}
          >
            <AdminDashboard />
          </ProtectedRouteAdmin>
        } />
        <Route path="/addProduct" element={
          <ProtectedRouteEmployee
            isAuthenticated={isAuthenticated}
          >
            <AddProductPage />
          </ProtectedRouteEmployee>
        } />
        <Route path="/managaeCategoriesAndBrands" element={
          <ProtectedRouteEmployee
            isAuthenticated={isAuthenticated}
          >
            <ManageCategoriesAndBrands />
          </ProtectedRouteEmployee>
        } />
        <Route path="/settings" element={
          <ProtectedRouteEmployee
            isAuthenticated={isAuthenticated}
          >
            <Settings />
          </ProtectedRouteEmployee>
        } />
        <Route path="/changeProduct" element={
          <ProtectedRouteEmployee
            isAuthenticated={isAuthenticated}
          >
            <ChangeProduct />
          </ProtectedRouteEmployee>
        } />
        <Route path="/loginAdmin" element={<LoginPageAdmin/>} />
        <Route path="/loginEmployee" element={<LoginPageEmployee />} />
      </Route>
    </Routes>
  )
}

export default App;