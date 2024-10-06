import { FormEvent, useEffect, useState } from "react";
import { RetrieveUsersContainer } from "./RetrieveUsers.styles";
import { useDispatcher } from "@/store/hooks";
import { DeleteUserType, setDeleteUser, setShowFloat } from "@/store/deleteUser";
import { Input } from "../ui/input";

type ContentType= "Admin" | "Employee" | ""

type AdminTableProps={
    url:string,
    content:ContentType,
    refresh:boolean
}

type UsersType={
    id:number,
    name:string
}

const RetrieveUsers = ({url, content, refresh}:AdminTableProps) => {
    const [users, setUsers] = useState<UsersType[]>([])
    const [filteredUsers, setFilteredUsers] = useState<UsersType[]>([])
    const dispatch=useDispatcher()
    const handleDeleteClick = (id:number, name:string)=>{
        const deleteUserPayload: DeleteUserType = {
            id,
            name,
            content: content
        };
        dispatch(setDeleteUser(deleteUserPayload))
        dispatch(setShowFloat(true))
    }
    useEffect(()=>{
        const fetchData=async()=>{
            const response=await fetch(url,{
                method:'get',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
            })
            const data=await response.json() as UsersType[]
            setUsers(data)
            setFilteredUsers(data)
        }
        fetchData()
    }, [refresh])


    const handleChange = (e: FormEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value.toLowerCase()
        const filtered = users.filter(user =>
            user.id.toString().includes(value) || user.name.toLowerCase().includes(value)
        );
        setFilteredUsers(filtered)
    }
    return (
        <RetrieveUsersContainer >
            <h1 className="self-center">{content} Table</h1>
            <Input
                className="mt-2 mb-2 border-black"
                placeholder="Search user"
                onChange={handleChange}
                />
            <table>
                <thead>
                    <tr className="border-b-2 border-black">
                        <th>ID</th>
                        <th>Name</th>
                    </tr>
                   
                </thead>
                <tbody>
                    {
                    filteredUsers.length &&
                    filteredUsers.map((user, index) => (
                        <tr key={user.id}
                            className={`text-center ${index % 2 === 0 ? 'bg-slate-200' : ''}`}
                         >
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td 
                            className="cursor-pointer"
                            onClick={()=>handleDeleteClick(user.id, user.name)}
                            >Delete</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </RetrieveUsersContainer>
  );
};

export default RetrieveUsers;