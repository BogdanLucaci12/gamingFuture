
import { toast } from "react-toastify";
import ButtonDisabled from "../button/ButtonDisabled.component";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ChangeDetailSubmitPCQContainer } from "./Change.styles";
import { hasTwoDecimalPlaces } from "@/utils/checkPrice";
import { FormEvent, useState } from "react";

type ChangeDetailSubmitType={
    title:string,
    value:string | number,
    productDetailId:number
}


const ChangeDetailSubmitPCQ = ({ title, value, productDetailId }:ChangeDetailSubmitType) => {
  const [disabled, setDisabled]=useState<boolean>(false)
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
        if(statusResponse.success) toast.success(statusResponse.success)
      setDisabled(false)
    
    }

  return (
    <ChangeDetailSubmitPCQContainer>
        <div className="flex flex-row gap-4">
              <p className="bg-black text-white rounded-lg px-7 text-lg">{title}:</p> 
              <p className="rounded-lg border-2 px-7">{value} {hasTwoDecimalPlaces(value) && 'RON'}</p>
        </div>
      <form onSubmit={handleSubmit}>
            <Label>Insert new {title.toLowerCase()}</Label>
            <Input
            className="w-[30em]"
            placeholder={title}
            name={title.toLowerCase()}
            />
              <ButtonDisabled
              disabled={disabled}
              className=""
              >
                Submit new {title.toLowerCase()}
              </ButtonDisabled>
          </form>
    </ChangeDetailSubmitPCQContainer>
  );
};

export default ChangeDetailSubmitPCQ;