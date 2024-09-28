import { ChangeProductContainer } from "./ChangeProduct.page.styles";
import { useContext, useEffect, useState } from "react";

import ChangeTitle from "@/components/changeProduct/ChangeTitle.component";
import ChangeBrandCategory from "@/components/changeProduct/ChangeCategoryBrand.component";
import { RegenerateContext } from "@/context/regenerate.context";
import ChangeDescription from "@/components/changeProduct/ChangeDescription.component";
import ChangePCQI, { DetailType } from "@/components/productDetails/ChangePCQI.component";
import { useSelectored } from "@/store/hooks";
type ProductType = {
  title: string,
  description: string,
  brand: string,
  category: string,
  subcategory: string
}



const ChangeProduct = () => {
  const [product, setProduct] = useState<ProductType>({
    title: '',
    description: '',
    brand: '',
    category: '',
    subcategory: ''
  })
  const { title, description, brand, category, subcategory } = product
  const { productId } = useSelectored(state => state.changeProduct)
  useEffect(() => {
    //query product for a short summary
    const fetchProduct = async () => {
      if(!productId) return
      const response = await fetch(`http://localhost:8626/employee/getProduct/${productId}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      const data = await response.json()
      setProduct(data[0])
    }
    fetchProduct()
  }, [productId])

  return (
    <ChangeProductContainer>
      <div className="flex flex-col">
        <ChangeTitle
          title={title}
          productId={productId}
        />
        <ChangeBrandCategory
          brand={brand}
          category={category}
          subcategory={subcategory}
          productId={productId}
        />
      </div>
      <ChangeDescription
        description={description}
        productId={productId}
      />
      <p className="text-center text-lg font-bold">Change detail about product or add more</p>
      <ChangePCQI/>
    </ChangeProductContainer>
  );
};

export default ChangeProduct;