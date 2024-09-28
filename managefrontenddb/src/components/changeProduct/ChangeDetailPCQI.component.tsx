import { useEffect, useState } from "react";
import { ChangeDetailPCQIContainer, ChangePCQ } from "./Change.styles";
import ChangeDetailSubmit from "./ChangeDetailSubmitPCQ.component";
import { useSelectored } from "@/store/hooks";
import ImageHandler from "../productDetails/ImageHandlerForChange.component";


type DetailType = {
    color: string,
    price: number,
    quantity: number
}

export type ImageType = {
    imageid: number,
    imageUrl: string
}

const ChangeDetailPCQI = () => {
    const { productDetailId } = useSelectored(state => state.changeProduct)
    const [details, setDetails] = useState<DetailType>({
        color: '',
        price: 0,
        quantity: 0
    })

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
            setDetails(data)
        }
        fetchPCQ()
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