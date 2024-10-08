
import LoginForm from "@/components/loginform/LoginForm.component";
import { DarkButton } from "@/components/button/Button.styles";
import { FormType } from "@/components/loginform/LoginForm.component";
import { useDispatcher, useSelectored } from "@/store/hooks";
import { setCurrentUser, type Rank } from "@/store/userSlice";
import { LoginContainer } from "./login.styles";
import { Link, useNavigate } from "react-router-dom";
import {  useEffect, useState } from "react";
import { toast } from "react-toastify";

type LoginProps={
url:string,
role:'Admin' | 'Employee'
}

const Login = ({ url, role }: LoginProps) => {
    const dispatch = useDispatcher()
    const {verifyToken}=useSelectored(state=>state.user)
    const [disabled, setDisabled] = useState<boolean>(false)
    const navigate=useNavigate()
    
    useEffect(()=>{
        verifyToken ? setDisabled(true) : setDisabled(false)
    }, [verifyToken])

    const handleSubmit = async (data: FormType)=> {
        setDisabled(true)
        const { username, password } = data
        const reponse = await fetch(url, {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
            },
            credentials:"include",
            body: JSON.stringify({ username: username, password: password })
        })
        const result = await reponse.json()
        if (result.success) {
            const { rank, name } = result
            dispatch(setCurrentUser({ name, isAuthenticated: true, rank: rank as Rank }))
            navigate("/home")
            toast.success("Welcome")
        }
        else{
            toast.error(result.error)
        }
        setDisabled(false)
    }

    return (
        <LoginContainer>
            <LoginForm submit={handleSubmit} role={role} disabled={disabled}/>
            
                {role === 'Admin' ? 
                    <Link to="/loginEmployee"> 
                <DarkButton className="absolute self-end bottom-2 right-2" padding="0 3em">
                    <b>Employee</b>
                </DarkButton>
                     </Link> 
                : 
                    <Link to="/loginAdmin">
                <DarkButton className="absolute self-end bottom-2 right-2" padding="0 3em">
                <b>
                Admin
                </b>
                </DarkButton>
                </Link>
}
        </LoginContainer>
    );
};

export default Login;