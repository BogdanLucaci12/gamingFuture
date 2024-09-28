import { AccountDropdownManu, AccountPanel, ControlPanel, NavBarContainer } from "./Navbar.styles"
import logo from '@/assets/logo.png'
import { LightButton, OutlineButton } from "@/components/button/Button.styles"
import { Outlet, useNavigate } from "react-router-dom"
import { useDispatcher, useSelectored } from "@/store/hooks"
import { Link } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { VscAccount } from "react-icons/vsc";
import { HiMiniBars4 } from "react-icons/hi2";
import { useWindowWidth } from "@/hooks/useWindowWidth.hooks"
import { useEffect, useState, useRef } from "react"
import { Rank, setCurrentUser } from "@/store/userSlice"
import Cookies from "universal-cookie"
import Overlay from "@/components/container/Overlay.component"
import AddDetail from "@/components/productDetails/AddDetail.component"


const NavBar = () => {
    const { name, rank } = useSelectored(state => state.user)
    const [showControlPanel, setShowControlPanel] = useState<boolean>(true)
    const [showAccountPanel, setShowAccountPanel] = useState<boolean>(false)
    const dispatch = useDispatcher()
    const cookies = new Cookies()
    const navigate = useNavigate()
    const screenWidth = useWindowWidth()
    const bars = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (screenWidth >= 735) {
            return setShowControlPanel(true)
        } else {
            setShowControlPanel(false)
        }
    }, [screenWidth])

    const handleMouseEnter = () => {
        setShowAccountPanel(true)
    }
    const handleMouseLeave = () => {
        setShowAccountPanel(false)
    }

    const handleMouseEnterBars = () => {
        if (screenWidth < 735) setShowControlPanel(true)
    }
    const handleMouseLeaveBars = () => {
        if (screenWidth < 735) setShowControlPanel(false)
    }

    const handleLogOut = async() => {
        dispatch(setCurrentUser({ name: '', isAuthenticated: false, rank: '' as Rank }))
        const response = await fetch('http://localhost:8626/employee/logOut', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        const data = await response.json()
        if(data.error) toast.warn(data.error)
        if(data.success) {
            // cookies.set('token', '', {
            //     maxAge: 0,
            // })
            navigate("/loginEmployee")
            toast.success(data.success)}
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
                            <Link to="/addProduct">
                                <LightButton>Add new product</LightButton>
                            </Link>
                            <Link to="/managaeCategoriesAndBrands">
                                <LightButton>Manage categories and brands</LightButton>
                            </Link>
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
                    {name &&
                        showAccountPanel &&
                        <AccountDropdownManu>
                            <div>Your role: <b>{rank}</b></div>
                            <div className="relative flex flex-col">
                                <OutlineButton>
                                    <Link to="/settings">
                                        Change password
                                    </Link>
                                </OutlineButton>
                                <OutlineButton onClick={handleLogOut}>
                                    Log out
                                </OutlineButton>
                            </div>
                        </AccountDropdownManu>
                    }
                </AccountPanel>
            </NavBarContainer>
            <ToastContainer theme="dark" />
            <Overlay>
                <AddDetail>
                    
                </AddDetail>
            </Overlay>
            <Outlet />
        </>
    )

}

export default NavBar