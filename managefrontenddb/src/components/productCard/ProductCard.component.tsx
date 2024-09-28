import { ProductType } from "@/pages/home/Home.page";
import { ProductCardContainer } from "./ProductCard.styles";
import { Button } from "../ui/button";

type ProductCardProps = ProductType

const ProductCard = ({ image, title, category, subcategory, id, brand }: ProductCardProps) => {
    return (
        <ProductCardContainer>
            <div className="w-full flex justify-center">
                <img src={image} alt="" className="rounded-md w-[10em]" />
            </div>
            <div className="h-full flex flex-col justify-between">
                <div className="flex flex-col p-2">
                    <p className="mt-2 mb-2">
                        {title}
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
                <div className="flex w-full justify-center">
                    <Button
                        className="max428:h-5"
                    >
                        <p>
                            Change product/add to product
                        </p>
                    </Button>
                </div>
            </div>
        </ProductCardContainer>
    );
};

export default ProductCard;