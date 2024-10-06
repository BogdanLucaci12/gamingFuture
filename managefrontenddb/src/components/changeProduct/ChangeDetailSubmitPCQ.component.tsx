
import { toast } from "react-toastify";
import ButtonDisabled from "../button/ButtonDisabled.component";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ChangeDetailSubmitPCQContainer } from "./Change.styles";
import { hasTwoDecimalPlaces } from "@/utils/checkPrice";
import { FormEvent, useContext, useState, useRef } from "react";
import { RegenerateContext } from "@/context/regenerate.context";

type ChangeDetailSubmitType={
    title:string,
    value:string | number,
    productDetailId:number
}


const ChangeDetailSubmitPCQ = ({ title, value, productDetailId }:ChangeDetailSubmitType) => {
  const [disabled, setDisabled]=useState<boolean>(false)
  const {setRefreshPCQ, refreshPCQ}=useContext(RegenerateContext)
  const form = useRef<HTMLFormElement>(null)
    const handleSubmit= async(event:FormEvent<HTMLFormElement>)=>{
      event.preventDefault()
      setDisabled(true)
      const dataForm=new FormData(event.currentTarget)
      const data=Object.fromEntries(dataForm)
      const response = await fetch(`http://localhost:8626/employee/updateProductDetail/${productDetailId}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body:JSON.stringify(data)
      })
      const statusResponse=await response.json()
      if(statusResponse.error) toast.error(statusResponse.error)
        if(statusResponse.success) {
          setRefreshPCQ(!refreshPCQ)
          toast.success(statusResponse.success)
          form.current?.reset()
        }
      setDisabled(false)
    }

  return (
    <ChangeDetailSubmitPCQContainer>
        <div className="flex flex-row gap-4">
              <p className="bg-black text-white rounded-lg px-7 text-lg">{title}:</p> 
              <p className="rounded-lg border-2 px-7">{value} {hasTwoDecimalPlaces(value) && 'RON'}</p>
        </div>
      <form 
      onSubmit={handleSubmit} 
      className="flex flex-col gap-3 w-full"
      ref={form}
      >
            <Label>Insert new {title.toLowerCase()}</Label>
            <Input
            className="w-full"
            placeholder={title}
            name={title.toLowerCase()}
            />
              <ButtonDisabled
              disabled={disabled}
              className="w-[12em]"
              >
                Submit new {title.toLowerCase()}
              </ButtonDisabled>
          </form>
    </ChangeDetailSubmitPCQContainer>
  );
};

export default ChangeDetailSubmitPCQ;