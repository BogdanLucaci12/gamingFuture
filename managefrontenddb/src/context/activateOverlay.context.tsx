import { createContext, ReactNode, useState } from "react";

type OverlayContextType={
    overlay:boolean,
    setOverlay:(value:boolean)=>void
}

export const OverlayContext = createContext<OverlayContextType>({
    overlay:false,
    setOverlay:()=>{}
})

type OverlayProviderType={
    children:ReactNode
}

export const OverlayProvider = ({ children }: OverlayProviderType) => {
    const [overlay, setOverlay]=useState<boolean>(false)
    const value = { overlay, setOverlay }

    return (
        <OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>
    )
}