import { Textarea } from '@/components/ui/textarea'
import ButtonDisabled from '../button/ButtonDisabled.component';
import { ChangeTitleContainer } from './ChangeProductComponent.style';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type ChangeTitleType = {
    title: string,
    productId:number
}

const ChangeTitle = ({ title, productId }: ChangeTitleType) => {
  
    const [disabled, setDisabled] = useState<boolean>(false)
    const [titleValue, setTitleValue]=useState<string>('')

    const handleChangeEvent = (event:ChangeEvent<HTMLTextAreaElement>)=>{
        const value=event.target.value
        //every changes we do in textarea we setted in titleValue, in order for textarea to be modified in interface
        setTitleValue(value)
    }

    useEffect(()=>{
        //initialized value in title input with the title from parent, aka original title from product
        setTitleValue(title)
    }, [title])

const handleTitleChange=async(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    setDisabled(true)
    const response = await fetch(`http://localhost:8626/employee/updateProductTitle/${productId}`, {
        method: "put",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({title:titleValue})
    })
    const dataResponse = await response.json()
    if (dataResponse.error) toast.error(dataResponse.error)
    if (dataResponse.success) toast.success(dataResponse.success)
    setDisabled(false)
 
}

    return (
        <ChangeTitleContainer
        onSubmit={handleTitleChange}
        >
            <b className='text-lg self-center text-md'>
                Product title
                </b>
           
            <Textarea
                value={titleValue}
              
                onChange={handleChangeEvent}
            />
            <div className="ml-auto">
                <ButtonDisabled
                    disabled={disabled}
                >
                    Submit new title
                </ButtonDisabled>
            </div>
        </ChangeTitleContainer>
    );
};

export default ChangeTitle;