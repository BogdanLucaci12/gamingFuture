import { type ReactNode, createContext, useState } from "react";

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
    refreshSpecificProductDetail:boolean,
    setRefreshSpecificProductDetail:(value:boolean)=>void
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
    refreshSpecificProductDetail: false,
    setRefreshSpecificProductDetail: () => {}
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
    const [refreshSpecificProductDetail, setRefreshSpecificProductDetail]=useState<boolean>(false)
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
        refreshSpecificProductDetail, 
        setRefreshSpecificProductDetail
    }

    return (
        <RegenerateContext.Provider value={value}>{children}</RegenerateContext.Provider>
    )
}