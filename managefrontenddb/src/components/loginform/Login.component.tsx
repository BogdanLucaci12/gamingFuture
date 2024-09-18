
import LoginForm from "@/components/loginform/LoginForm.component";
import { DarkButton } from "@/components/button/Button.styles";
import { FormType } from "@/components/loginform/LoginForm.component";
import { useDispatcher } from "@/store/hooks";
import { setCurrentUser, type Rank } from "@/store/userSlice";
import Cookies from 'universal-cookie'
import { LoginContainer } from "./login.styles";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

type ResultType = {
    success: string,
    user: string,
    rank: string,
    token: string
}

type LoginProps={
url:string,
role:'Admin' | 'Employee'
}

const Login = ({ url, role }: LoginProps) => {
    const dispatch = useDispatcher()
    const cookies = new Cookies()
    const [disabled, setDisabled] = useState<boolean>(false)
    const navigate=useNavigate()
    const handleSubmit = async (data: FormType): Promise<void> => {
        setDisabled(true)
        const { username, password } = data
        const reponse = await fetch(url, {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: username, password: password })
        })
        const result: ResultType = await reponse.json()
        const name = result.user
        const { rank, success, token } = result
        if (success) {
            dispatch(setCurrentUser({ name, isAuthenticated: true, rank: rank as Rank }))
            cookies.set('token', token, {
                maxAge: 30 * 60 * 60 * 1000,
            })
            navigate("/Home")
            toast.success("Welcome")
        }
        setDisabled(false)
    }

    return (
        <LoginContainer>

            <LoginForm submit={handleSubmit} role={role} disabled={disabled}/>
            <DarkButton className="absolute self-end bottom-2 right-2" padding="0 3em">
                {role === 'Admin' ? <b> <Link to="/loginEmployee">Employee</Link> </b> : <b><Link to="/loginAdmin">Admin</Link></b>}
            </DarkButton>

        </LoginContainer>
    );
};

export default Login;