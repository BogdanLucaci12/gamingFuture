import { Dispatch, type ReactNode, SetStateAction, createContext, useState } from "react";

type RegenerateContextType = {
    refreshEmployeeTable: boolean
    setRefreshEmployeeTable: (value: boolean) => void,
    refreshAdminTable: boolean,
    setRefreshAdminTable: (value: boolean) => void,
    refreshCategoriesTable: boolean,
    setRefreshCategoriesTable: (value: boolean) => void,
    refreshBrandsTable: boolean,
    setRefreshBrandsTable: (value: boolean) => void,
    refreshProduct: boolean,
    setRefreshProduct: (value:boolean) => void,
    refreshImageDetail:boolean,
    setRefreshImageDetail:(value:boolean)=>void,
    refreshPCQ:boolean,
    setRefreshPCQ: Dispatch<SetStateAction<boolean>>;
    refreshDetails: boolean,
    setRefreshDetails: (value: boolean) => void,
    refreshProductsHome:boolean,
    setRefreshProductsHome:(value:boolean)=>void
}

export const RegenerateContext = createContext<RegenerateContextType>({
    refreshEmployeeTable: false,
    setRefreshEmployeeTable: () => { },
    refreshAdminTable: false,
    setRefreshAdminTable: () => { },
    refreshCategoriesTable: false,
    setRefreshCategoriesTable: () => { },
    refreshBrandsTable: false,
    setRefreshBrandsTable: () => { },
    refreshProduct: false,
    setRefreshProduct: () => { },
    refreshImageDetail: false,
    setRefreshImageDetail: () => {},
    refreshPCQ:false,
    setRefreshPCQ:()=>{},
    refreshDetails: false,
    setRefreshDetails: () => { },
    refreshProductsHome:false,
    setRefreshProductsHome:()=>{}
})

type RegenerateProviderType = {
    children: ReactNode
}

export const RegenerateProvider = ({ children }: RegenerateProviderType) => {
    const [refreshEmployeeTable, setRefreshEmployeeTable] = useState<boolean>(false)
    const [refreshAdminTable, setRefreshAdminTable] = useState<boolean>(false)
    const [refreshCategoriesTable, setRefreshCategoriesTable] = useState<boolean>(false)
    const [refreshBrandsTable, setRefreshBrandsTable] = useState<boolean>(false)
    const [refreshProduct, setRefreshProduct] = useState<boolean>(false)
    const [refreshImageDetail, setRefreshImageDetail]=useState<boolean>(false)
    const [refreshPCQ, setRefreshPCQ]=useState<boolean>(false)
    const [refreshDetails, setRefreshDetails]=useState<boolean>(false)
    const [refreshProductsHome, setRefreshProductsHome]=useState<boolean>(false)
    
    const value = {
        refreshEmployeeTable,
        setRefreshEmployeeTable,
        refreshAdminTable,
        setRefreshAdminTable,
        refreshCategoriesTable,
        setRefreshCategoriesTable,
        refreshBrandsTable,
        setRefreshBrandsTable,
        refreshProduct,
        setRefreshProduct,
        refreshImageDetail, 
        setRefreshImageDetail,
        refreshPCQ, 
        setRefreshPCQ,
        refreshDetails, 
        setRefreshDetails,
        refreshProductsHome, 
        setRefreshProductsHome
    }

    return (
        <RegenerateContext.Provider value={value}>{children}</RegenerateContext.Provider>
    )
}