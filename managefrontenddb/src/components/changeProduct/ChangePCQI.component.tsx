import {  useContext, useEffect, useState } from "react";
import { ChangePCQIContainer, ChangePCQIScrollContainer } from "../productDetails/ProductDetails.styles";
import { IoGameControllerOutline } from "react-icons/io5";
import Detail from "../productDetails/Detail.component";
import ChangeDetailPCQI from "./ChangeDetailPCQI.component";
import { useSelectored } from "@/store/hooks";
import { CiCirclePlus } from "react-icons/ci";
import { useDispatcher } from "@/store/hooks";
import { setActive, setAddDetail } from "@/store/overlaySlice";
import { RegenerateContext } from "@/context/regenerate.context";


export type DetailType = {
    id: number,
    quantity: number,
    price: number,
    color: string
}

export type QueryImageDetailType={
    color:string,
    price:number,
    quantity:number,
    imageurl:string,
    imageid:number
}

const ChangePCQI = () => {
    const [PCQ, setPCQ] = useState<DetailType[]>([])
    const { clickedOnDetailContainer }=useSelectored(state=>state.changeProduct)
    const { productId }=useSelectored(state=>state.changeProduct)
    const {refreshDetails, refreshPCQ}=useContext(RegenerateContext)
    const dispatch=useDispatcher()
    useEffect(() => {
        //query price, color and quantity
        const fetchPCQ = async () => {
            if(!productId) return
            const response = await fetch(`http://localhost:8626/employee/getProductDetails/${productId}`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            const data = await response.json()
            setPCQ(data)
        }
        fetchPCQ()
    }, [productId, refreshDetails, refreshPCQ])

    const handleClick =()=>{
        dispatch(setActive(true))
        dispatch(setAddDetail(true))
    }

    return (
        <ChangePCQIContainer>
            <ChangePCQIScrollContainer>
                {
                    PCQ.length ?
                        PCQ.map((detail: DetailType) =>
                            <Detail
                                key={detail.id}
                                detailId={detail.id}
                                color={detail.color}
                                price={detail.price}
                                quantity={detail.quantity}
                            />
                        )
                        :
                        (<IoGameControllerOutline className="mr-2 h-6 w-6 animate-spin" />)
                }
                <div 
                className="w-[12em] flex justify-center items-center border-4 border-black rounded-lg cursor-pointer"
                onClick={handleClick}
                >
                    <CiCirclePlus className="w-16 h-16 hover:scale-125 hover:ease-in-out duration-300"/>
                </div>
            </ChangePCQIScrollContainer>
                    {
                clickedOnDetailContainer && <ChangeDetailPCQI />
                    }
        </ChangePCQIContainer>
    );
};

export default ChangePCQI;