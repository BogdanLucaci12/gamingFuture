import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import ButtonDisabled from "../button/ButtonDisabled.component";
import { FormEvent, useState, useRef, useContext } from "react";
import { useSelectored } from "@/store/hooks";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatcher } from "@/store/hooks";
import { setActive, setConfirmDeleteProduct } from "@/store/overlaySlice";
import { RegenerateContext } from "@/context/regenerate.context";
import { IoMdClose } from "react-icons/io";

const DeleteProduct = () => {
  const [disabled, setDisabled] = useState<boolean>(false)
  const formRef = useRef<HTMLFormElement>(null)
  const navigate=useNavigate()
  const dispatch=useDispatcher()
  const { productId } = useSelectored(state => state.changeProduct)
  const { confirmDeleteProduct, activate }=useSelectored(state=>state.overlaySlice)
  const { refreshProductsHome, setRefreshProductsHome }=useContext(RegenerateContext)

  const handleCloseContainer = () =>{
    dispatch(setActive(!activate))
    dispatch(setConfirmDeleteProduct(!confirmDeleteProduct))
  }
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setDisabled(true)
    const formData = new FormData(event.currentTarget)
    const formObject = Object.fromEntries(formData)
    const { confirmId } = formObject
    if (Number(confirmId) !== productId) {
      setDisabled(false)
      toast.warn("Wrong product id")
      return;
    }
    const response = await fetch(`http://localhost:8626/employee/deleteProduct/${productId}`, {
      method: 'delete',
      credentials: 'include'
    })
    const statusResponse = await response.json()
    if (statusResponse.error) {
       setDisabled(false) 
      toast.error(statusResponse.error)
    }
    if (statusResponse.success) {
      toast.success(statusResponse.success)
      dispatch(setActive(false))
      dispatch(setConfirmDeleteProduct(false))
      setRefreshProductsHome(!refreshProductsHome)
      navigate("/home")
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <IoMdClose
        className="absolute right-0 m-1 w-10 h-10 hover:rotate-180	hover:ease-in-out cursor-pointer duration-500"
        onClick={handleCloseContainer}
      />
      <p className="border-b-4 self-center">Delete product</p>
      <p>If you wanna delete this product you must insert product id</p>
      <form
        action=""
        className="flex flex-col gap-2"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <Label htmlFor="confirmId">Confirm id</Label>
        <Input
          type="text"
          id="confirmId"
          name="confirmId"
        />
        <ButtonDisabled
          disabled={disabled}
          className="w-[14em]"
        >
          Delete Product
        </ButtonDisabled>
      </form>
    </div>
  );
};

export default DeleteProduct;