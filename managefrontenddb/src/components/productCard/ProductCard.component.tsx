import { ProductType } from "@/pages/home/Home.page";
import { ProductCardContainer } from "./ProductCard.styles";
import { Button } from "../ui/button";
import { useDispatcher } from "@/store/hooks";
import { setProductId } from "@/store/changeProductSlice";
import { useNavigate } from "react-router-dom";
import { useWindowWidth } from "@/hooks/useWindowWidth.hooks";
import { useEffect, useState } from "react";
type ProductCardProps = ProductType

const ProductCard = ({ image, title, category, subcategory, id, brand }: ProductCardProps) => {

    const [cutTitle, setCutTitle]=useState<string>('')
    const dispatch=useDispatcher()  
    const navigate=useNavigate()
    const handleClickOnProduct = ()=>{
        dispatch(setProductId(id))
        navigate("/changeProduct")
    }
    const screenWidth=useWindowWidth()
    useEffect(()=>{
        screenWidth < 735 ? setCutTitle(title.substring(0, 50).concat('...')) : setCutTitle(title)
    }, [title, screenWidth])
    return (
        <ProductCardContainer>
            <div className="w-full flex justify-center">
                <img src={image} alt="" className="rounded-md w-[10em] h-[8em]" />
            </div>
            <div className="h-full flex flex-col justify-between">
                <div className="flex flex-col p-2">
                    <p className="mt-2 mb-2">
                        {cutTitle}
                    </p>
                    <p>
                        <b>Category: </b>
                        {category}</p>
                    <p>
                        <b>Subcategory: </b>
                        {subcategory}</p>
                    <p>
                        <b>Brand: </b>
                        {brand}</p>
                    <p> <b>Product id: </b>
                        {id}</p>
                </div>
                <div className="flex w-full justify-center"
                onClick={handleClickOnProduct}
                >
                    <Button
                        className="max428:h-5"
                    >
                        <p>
                            Edit product
                        </p>
                    </Button>
                </div>
            </div>
        </ProductCardContainer>
    );
};

export default ProductCard;