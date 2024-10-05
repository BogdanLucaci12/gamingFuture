import { LoginFormContainer } from "../container/CardContainer.styles";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { useRef, type FormEvent } from "react";
import ButtonDisabled from "../button/ButtonDisabled.component";

export type FormType={
    username:string,
    password:string
}

type LoginFormProps={
    submit:(data:FormType)=>void,
    role:'Admin' | 'Employee',
    disabled:boolean
}

const LoginForm = ({ submit, role, disabled }:LoginFormProps) => {
    const form = useRef<HTMLFormElement>(null)
    const handleSubmit = (e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData) as FormType;
        submit(data)
    }
    return (
        <LoginFormContainer>
            <div className="flex justify-center">
                <p className="text-xl font-bold">LogIn for {role}</p>
            </div>
            <form action="" onSubmit={handleSubmit} ref={form}>
                <div className="p-3">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        type="text"
                        name="username"
                        placeholder="Username"
                        autoComplete="off"
                    />
                </div>
                <div className="p-3">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Password"
                    />
                </div>
                <div className="flex justify-end">
                    <ButtonDisabled
                    disabled={disabled}
                    className=""
                    >Log in</ButtonDisabled>
                </div>
            </form>
        </LoginFormContainer>
    );
};

export default LoginForm;