import { useSelectored, useDispatcher } from "@/store/hooks";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FloatPanelContainer, MainBody } from "./FloatContainer.styles";
import { IoMdClose } from "react-icons/io";
import { setShowFloat } from "@/store/deleteUser";
import {type FormEvent, useContext, useRef, useState } from "react";
import { toast } from "react-toastify";
import { IoGameControllerOutline } from "react-icons/io5";
import { RegenerateContext } from "@/context/regenerate.context";

type DataType= {
    username:string
}

const url = {
    admin: "http://localhost:8626/admin/deleteUserAdmin",
    employee: "http://localhost:8626/admin/deleteUserEmployee"
}

const FloatPanel = () => {
    const { id, content, name } = useSelectored(state => state.adminDashboard.deleteUser)
    const dispatch = useDispatcher()
    const form = useRef<HTMLFormElement>(null)
    const [disabled, setDisabled]=useState<boolean>(false)
    const {setRefreshEmployeeTable, refreshEmployeeTable, setRefreshAdminTable, refreshAdminTable}=useContext(RegenerateContext)

    const handleClose = () => {
        dispatch(setShowFloat(false))
    }

    const handleDeleteUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setDisabled(true)
    const formData=new FormData(e.currentTarget)
    const {username}=Object.fromEntries(formData) as DataType
    if(!username){
        toast.warn("No username provided")
        return
    } 
        const response = await fetch(content === 'Admin' ? url.admin : url.employee, {
        method: "delete",
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body:JSON.stringify({
            username:username
        })
        })
        const dataFetch=await response.json()
        if(dataFetch.error) toast.error(dataFetch.error)
        if(dataFetch.success) {
            toast.success(dataFetch.success)
            content==="Admin" ? setRefreshAdminTable(!refreshAdminTable) : setRefreshEmployeeTable(!refreshEmployeeTable)
            dispatch(setShowFloat(false))
        }
        setDisabled(false)
        form.current?.reset()
}

return (
    <MainBody>
        <FloatPanelContainer>
            <IoMdClose 
            onClick={handleClose} 
            className="absolute right-0 m-1 w-7 h-7 cursor-pointer hover:animate-spin"
            />
            <div className="text-center border-b-4">Delete a user from {content}</div>
            <div>To delete {name} with id= {id}, please provide their username.</div>
            <form
                className="grid gap-3 w-11/12"
                onSubmit={handleDeleteUser}
                ref={form}
            >
                <div className="w-full">
                    <Label htmlFor="username">
                        Username
                    </Label>
                    <Input 
                    type="text"
                     id="username"
                      name="username"
                      autoComplete="off"
                      />
                </div>
                <Button
                    className="w-32"
                    disabled={disabled}
                >
                    {
                        disabled &&
                        <IoGameControllerOutline className="mr-2 h-6 w-6 animate-spin" />
                    }
                    Submit</Button>
            </form>
        </FloatPanelContainer>
    </MainBody>
);
};

export default FloatPanel;