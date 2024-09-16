import { NavBarContainer } from "./Navbar.styles"
import logo from '@/assets/logo.png'
import { LightButton } from "@/components/button/Button.styles"
import { Outlet } from "react-router-dom"
const NavBar = () => {

    return (
        <>
    <NavBarContainer>
        <div>
        <img src={logo} alt="" />
        </div>
        <div className="flex flex-row gap-3">
            <LightButton>Add new product</LightButton>
            <LightButton>Edit a product</LightButton>
        </div>
        <div>
            username
        </div>
    </NavBarContainer>
    <Outlet/>
        </>
    )
   
}

export default NavBar