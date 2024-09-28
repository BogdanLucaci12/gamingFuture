import { DetailContainer } from "./ProductDetails.styles";
import { useDispatcher } from "@/store/hooks";
import { setProductDetailId, setClickedOnDetailContainer } from "@/store/changeProductSlice";
type DetailPropsType = {
  detailId: number,
  color: string,
  price: number,
  quantity: number,
}

const Detail = ({ detailId, color, price, quantity }: DetailPropsType) => {
  const dispatch = useDispatcher()

  const handleClick = () => {
    dispatch(setProductDetailId(detailId))
    dispatch(setClickedOnDetailContainer(true))
  }

  return (
    <DetailContainer onClick={handleClick}>
      <p>
        <b>Id: </b>
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