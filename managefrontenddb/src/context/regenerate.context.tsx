import { type ReactNode, createContext, useState } from "react";

type RegenerateContextType={
    refreshEmployeeTable:boolean
    setRefreshEmployeeTable:(value:boolean)=>void,
    refreshAdminTable:boolean,
    setRefreshAdminTable: (value: boolean) => void,
}

export const RegenerateContext = createContext<RegenerateContextType>({
    refreshEmployeeTable:false,
    setRefreshEmployeeTable:()=>{},
    refreshAdminTable:false,
    setRefreshAdminTable:()=>{}
})

type RegenerateProviderType={
    children:ReactNode
}

export const RegenerateProvider = ({ children }: RegenerateProviderType)=>{
    const [refreshEmployeeTable, setRefreshEmployeeTable]=useState<boolean>(false)
    const [refreshAdminTable, setRefreshAdminTable]=useState<boolean>(false)
    const value = { refreshEmployeeTable, setRefreshEmployeeTable, refreshAdminTable, setRefreshAdminTable }

    return(
        <RegenerateContext.Provider value={value}>{children}</RegenerateContext.Provider>
    )
}