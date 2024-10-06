import TextEditor from "@/components/addProductForm/TextEditor.component";
import ButtonDisabled from "../button/ButtonDisabled.component";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { RegenerateContext } from "@/context/regenerate.context";

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
      <div className="mt-8">
            <p className="text-lg text-center">
                <b>
                Product description
                </b>
                </p>
          <div 
          dangerouslySetInnerHTML={{ __html: description }} 
          className="mb-3"
          />
          <TextEditor
              value={description}
              onChange={value=>setTextEditor(value)}
              resetValue={false}
          />
            <div onClick={handleClick}
            className="w-[15em]"
            >
          <ButtonDisabled
          disabled={disabled}
                  className="w-[15em] max735:mt-10"
          
          >
            Submit new description
          </ButtonDisabled>
            </div>
    
      </div>
  );
};

export default ChangeDescription;