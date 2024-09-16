import NavBar from "@/layout/navBar/NavBar.component"
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home.component";
import Login from "./pages/login/LoginPage.component";
import ProtectedRoute from "./utils/ProtectedRoute.component";

const App =()=> {
  const isAuthenticated:boolean=false;
  return (
    <Routes>
      <Route path="/" element={<NavBar />}>
        <Route index element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
           <Home/>
          </ProtectedRoute>
        }/>
        <Route path="login" element={<Login/>}/>
      </Route>
    </Routes>
  )
}

export default App
