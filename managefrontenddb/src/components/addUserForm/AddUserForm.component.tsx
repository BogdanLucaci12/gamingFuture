
import { type FormEvent, useState, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { AddUserFormContainer } from "./AddUserForm.styles";
import { toast } from "react-toastify";
import { IoGameControllerOutline } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";

type AddUserFormType = {
    url:string,
    content:string,
    refresh:boolean,
    setRefresh:(value:boolean)=>void
}

type FormAddUserType = {
    username: string,
    password: string,
    confirmPassword: string,
    name: string
}

const AddUserForm = ({ url, content, refresh, setRefresh }: AddUserFormType) => {
    const [disabled, setDisabled] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const form=useRef<HTMLFormElement>(null)
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setDisabled(true)
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData) as FormAddUserType
        const { username, password, name, confirmPassword } = data
        if (!username) { 
            setDisabled(false) 
           return toast.warn("Please provide a username")
        }
        if (!password) {
            setDisabled(false)
            return toast.warn("Please provide a password")
        }
        if (!confirmPassword) {
            setDisabled(false)
            return toast.warn("Please provide a confirmPassword")
        }
        if (!name) {
            setDisabled(false)
            return toast.warn("Please provide a name")
        }
        if (password !== confirmPassword){
            setDisabled(false)
           return toast.warn("Password doesnt match")}
        const response = await fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                username: username,
                password: password,
                name: name,
                confirmPassword: confirmPassword
            })
        })
        const dataFetch = await response.json()
        if (dataFetch.error) { toast.error(dataFetch.error) }
        if (dataFetch.success) { toast.success(dataFetch.succes) }
        setRefresh(!refresh)
        setDisabled(false)
        form.current?.reset()
    }

    return (
        <AddUserFormContainer>
            <div className="w-full flex flex-row justify-center">
                <p className="text-lg border-b-4">Add new {content} user</p>
            </div>
            <form action="" onSubmit={handleSubmit} ref={form}>
                <div>
                    <Label htmlFor="username">Username</Label>
                    <Input 
                    placeholder="Username" 
                    id={`username ${content}`} 
                    name="username" 
                    type="text" 
                    />
                </div>
                <div>
                    <Label htmlFor="Password" className="flex gap-2">
                        Password 
                        <FaRegEyeSlash 
                        className="cursor-pointer h-4 w-4"
                            onClick={()=>setShowPassword(!showPassword)}
                        />
                        </Label>
                    <Input 
                    placeholder="Password" 
                    id={`Password ${content}`} 
                    name="password" 
                    type={`${showPassword ? `text` : 'password'}`}
                     />
                </div>
                <div>
                    <Label htmlFor="Password" className="flex gap-2">
                        Confirm Password 
                        <FaRegEyeSlash 
                        className="cursor-pointer h-4 w-4" 
                        onClick={() => setShowPassword(!showPassword)}
                        />
                        </Label>
                    <Input 
                    placeholder="Confirm password" 
                    id={`Confirm password ${content}`} 
                    name="confirmPassword" 
                    type={`${showPassword ? `text` : 'password'}`} 
                    />
                </div>
                <div>
                    <Label htmlFor="Name">Name</Label>
                    <Input 
                    placeholder="Name" 
                    id={`Name ${content}`} 
                    name="name" 
                    type="text" 
                    />
                </div>
                <Button
                    disabled={disabled}>
                    {
                        disabled &&
                        <IoGameControllerOutline className="mr-2 h-6 w-6 animate-spin"/>
                    }
                    Add new {content} user</Button>
            </form>
        </AddUserFormContainer>
    );
};

export default AddUserForm;