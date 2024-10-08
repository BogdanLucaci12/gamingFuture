import {  useContext, useEffect, useState } from "react";
import { ChangeDetailPCQIContainer, ChangePCQ } from "./Change.styles";
import ChangeDetailSubmit from "./ChangeDetailSubmitPCQ.component";
import { useSelectored } from "@/store/hooks";
import ImageHandler from "../productDetails/ImageHandler.component";
import { toast } from "react-toastify";
import { io } from 'socket.io-client';
import { RegenerateContext } from "@/context/regenerate.context";

const socket = io('http://localhost:8626');

type DetailType = {
    color: string,
    price: number,
    quantity: number
}

export type ImageType = {
    imageid: number,
    imageurl: string
}

const ChangeDetailPCQI = () => {
    const { productDetailId } = useSelectored(state => state.changeProduct)
    const [details, setDetails] = useState<DetailType>({
        color: '',
        price: 0,
        quantity: 0
    })
    const { refreshPCQ, setRefreshPCQ }=useContext(RegenerateContext)
    useEffect(() => {
        const fetchPCQ = async () => {
            if(!productDetailId) return
            const response = await fetch(`http://localhost:8626/employee/getProductDetailPCQ/${productDetailId}`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            const data = await response.json()
            if(data.error) return toast.error(data.error)
            setDetails(data[0])
        }
        fetchPCQ()

    }, [productDetailId, refreshPCQ])

    useEffect(()=>{
        socket.on('updateQuantity', () => {
            setRefreshPCQ(prev => !prev);
        });

        return () => {
            socket.off('updateQuantity');
        };
    }, [])

    return (
        <ChangeDetailPCQIContainer>
            <ChangePCQ>
                <ChangeDetailSubmit
                    title="Color"
                    value={details.color}
                    productDetailId={productDetailId}
                />
                <ChangeDetailSubmit
                    title="Price"
                    value={details.price}
                    productDetailId={productDetailId}
                />
                <ChangeDetailSubmit
                    title="Quantity"
                    value={details.quantity}
                    productDetailId={productDetailId}
                />
            </ChangePCQ>
            <ImageHandler/>
        </ChangeDetailPCQIContainer>
    );
};

export default ChangeDetailPCQI;