import { ChangeProductContainer } from "./ChangeProduct.page.styles";
import { useContext, useEffect, useState } from "react";
import { IoGameControllerOutline } from "react-icons/io5";
import ChangeTitle from "@/components/changeProduct/ChangeTitle.component";
import ChangeBrandCategory from "@/components/changeProduct/ChangeCategoryBrand.component";
import ChangeDescription from "@/components/changeProduct/ChangeDescription.component";
import ChangePCQI from "@/components/changeProduct/ChangePCQI.component";
import { useSelectored } from "@/store/hooks";
import { DarkButton } from "@/components/button/Button.styles";
import { useDispatcher } from "@/store/hooks";
import { setActive, setConfirmDeleteProduct } from "@/store/overlaySlice";
import { RegenerateContext } from "@/context/regenerate.context";

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
  const {refreshProduct}=useContext(RegenerateContext)
  const dispatch=useDispatcher()
  useEffect(() => {
    //query product for title, description, brand, category, subcategory 
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
  }, [productId, refreshProduct])

  const handleDeleteProduct = ()=>{
    dispatch(setActive(true))
    dispatch(setConfirmDeleteProduct(true))
  }

  //if there are not a product id then show a picture that loading
  if (!productId) return <IoGameControllerOutline className="mr-2 h-6 w-6 animate-pulse" />

  return (
    <ChangeProductContainer>
      <div className="flex flex-row items-center gap-3 ">
      <b>
          Product id: {productId}
      </b>
        <DarkButton
        padding=""
        className="w-[8em]"
        onClick={handleDeleteProduct}
        >
          Delete product
        </DarkButton>
      </div>
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