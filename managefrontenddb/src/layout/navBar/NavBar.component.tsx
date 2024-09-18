import { AccountDropdownManu, AccountPanel, ControlPanel, NavBarContainer } from "./Navbar.styles"
import logo from '@/assets/logo.png'
import { LightButton, OutlineButton } from "@/components/button/Button.styles"
import { Outlet } from "react-router-dom"
import { useSelectored } from "@/store/hooks"
import { Link } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { VscAccount } from "react-icons/vsc";
import { HiMiniBars4 } from "react-icons/hi2";
import { useWindowWidth } from "@/hooks/useWindowWidth.hooks"
import { useEffect, useState, useRef } from "react"


const NavBar = () => {
    const { name, rank } = useSelectored(state => state.user)
    const [showControlPanel, setShowControlPanel] = useState<boolean>(true)
    const screenWidth = useWindowWidth()
    const bars = useRef<HTMLDivElement>(null)
    const [showAccountPanel, setShowAccountPanel]=useState<boolean>(false)
    useEffect(() => {
        if (screenWidth >= 735) {
            return setShowControlPanel(true)
        } else {
            setShowControlPanel(false)
        }
    }, [screenWidth])


    const handleMouseEnter=()=>{
        setShowAccountPanel(true)
    }
    const handleMouseLeave = () => {
        setShowAccountPanel(false)
    }

    const handleMouseEnterBars = () => {
        if(screenWidth<735) setShowControlPanel(true)
    }
    const handleMouseLeaveBars = () => {
        if (screenWidth < 735) setShowControlPanel(false)
    }

    return (
        <>
            <NavBarContainer>
                <div>
                    <Link to="/home">
                        <img src={logo} alt="" />
                    </Link>
                </div>
                <div className="relative" ref={bars}>
                    {
                        screenWidth <= 735 &&
                        <HiMiniBars4
                            className="w-7 h-7 cursor-pointer"
                            onMouseEnter={handleMouseEnterBars}
                            onMouseLeave={handleMouseLeaveBars}
                        />
                    }
                    {
                        showControlPanel &&
                        <ControlPanel
                                onMouseEnter={handleMouseEnterBars}
                                onMouseLeave={handleMouseLeaveBars}
                        >
                            <LightButton>Add new product</LightButton>
                            <Link to="/home">
                                <LightButton>
                                    Edit a product
                                </LightButton>
                            </Link>
                            {
                                rank === "Admin"
                                &&
                                <Link to="/admin-dashboard">
                                    <LightButton>
                                        Admin Dashboard
                                    </LightButton>
                                </Link>
                            }
                        </ControlPanel>
                    }

                </div>
                <AccountPanel 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}
                >
                    <VscAccount className="w-7 h-7" />
                    {name}
                    {
                        showAccountPanel &&
                    <AccountDropdownManu>
                        <div>Your role: <b>{rank}</b></div>
                        <div className="relative flex flex-col">
                            <OutlineButton>
                                <Link to="">
                                    Change password
                                </Link>
                            </OutlineButton>
                            <OutlineButton>
                                <Link to="">
                                    Log out
                                </Link>
                            </OutlineButton>
                        </div>
                    </AccountDropdownManu>
                    }
                </AccountPanel>
            </NavBarContainer>
            <ToastContainer />
            <Outlet />
        </>
    )

}

export default NavBar