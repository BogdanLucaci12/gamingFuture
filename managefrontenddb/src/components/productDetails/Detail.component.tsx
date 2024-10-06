import { DetailContainer } from "./ProductDetails.styles";
import { useDispatcher, useSelectored } from "@/store/hooks";
import { setProductDetailId, setClickedOnDetailContainer } from "@/store/changeProductSlice";
import { useEffect, useState } from "react";
type DetailPropsType = {
  detailId: number,
  color: string,
  price: number,
  quantity: number,
}

const Detail = ({ detailId, color, price, quantity }: DetailPropsType) => {
  const [clicked, setClicked] = useState(false);

  const dispatch = useDispatcher()
  const { productDetailId }=useSelectored(state=>state.changeProduct)
  const handleClick = () => {
    dispatch(setProductDetailId(detailId))
    dispatch(setClickedOnDetailContainer(true))
}

  useEffect(()=>{
  productDetailId===detailId ? setClicked(true): setClicked(false)
  }, [productDetailId])

  return (
    <DetailContainer
     onClick={handleClick}
     clicked={clicked}
     >
      <p>
        <b>Detail Id: </b>
        {detailId}
      </p>
      <p>
        <b>Color: </b>
        {color}
      </p>
      <p>
        <b>Price: </b>
        {price} RON
      </p>
      <p>
        <b>Quantity: </b>
        {quantity}
      </p>


    </DetailContainer>
  );
};

export default Detail;