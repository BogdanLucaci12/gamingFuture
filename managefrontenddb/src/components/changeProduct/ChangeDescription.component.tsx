import TextEditor from "@/components/addProductForm/TextEditor.component";
import ButtonDisabled from "../button/ButtonDisabled.component";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { RegenerateContext } from "@/context/regenerate.context";
import { ChandeDescriptionContainer } from "./Change.styles";

type ChangeDescriptionType={
    description:string,
    productId:number
}

const ChangeDescription = ({ description, productId }: ChangeDescriptionType) => {
    const [textEditor, setTextEditor]=useState<string>('')
    const [disabled, setDisabled]=useState<boolean>(false)
    const {refreshProduct, setRefreshProduct}= useContext(RegenerateContext)
    const handleClick = async()=>{
        setDisabled(true)
        const response = await fetch(`http://localhost:8626/employee/updateDescription/${productId}`,{
            method:'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                description:textEditor
            }),
            credentials: 'include'
        })
        const data = await response.json()
        if(data.error) toast.error(data.error)
        if(data.success) {
            setRefreshProduct(!refreshProduct)
            toast.success(data.success)}
        setDisabled(false)
    }

  return (
      <ChandeDescriptionContainer>
            <p className="text-lg text-center">
                <b className="border-b-4">
                Product description
                </b>
                </p>
          <div 
          dangerouslySetInnerHTML={{ __html: description }} 
          className="mb-3 w-full"
          />
          <TextEditor
              value={description}
              onChange={value=>setTextEditor(value)}
              resetValue={false}
          />
          <ButtonDisabled
          disabled={disabled}
          className="max735:mt-10"
          onClick={handleClick}
          >
            Submit new description
          </ButtonDisabled>
      </ChandeDescriptionContainer>
  );
};

export default ChangeDescription;