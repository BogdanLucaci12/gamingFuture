import {  useEffect, useState } from "react";
import { ChangePCQIContainer } from "./ProductDetails.styles";
import { IoGameControllerOutline } from "react-icons/io5";
import Detail from "./Detail.component";
import ChangeDetailPCQI from "../changeProduct/ChangeDetailPCQI.component";
import { useSelectored } from "@/store/hooks";




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
    }, [productId])

    return (
        <ChangePCQIContainer>
            <div className="h-[8em] overflow-x-auto border-b-4">
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
            </div>
                    {
                clickedOnDetailContainer && <ChangeDetailPCQI />
                    }
                  
        </ChangePCQIContainer>
    );
};

export default ChangePCQI;