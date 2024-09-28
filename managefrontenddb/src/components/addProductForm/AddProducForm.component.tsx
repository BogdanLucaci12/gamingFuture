import { FormEvent, useState, useRef, useEffect } from "react";
import { Label } from "../ui/label";
import { AddProductFormContainer } from "./AddProductForm.styles";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import TextEditor from "./TextEditor.component";
import ButtonDisabled from "../button/ButtonDisabled.component";
import { toast } from "react-toastify";



export type QueryParamsType={
    title:string,
    color:string,
    price:number,
    quantity:number,
    photos:File[],
    description:string
}

type AddProducFormType={
    submit: (formData:QueryParamsType)=>void
    disabledButton:boolean,
    clearForm:boolean
}


const AddProductForm = ({ submit, disabledButton, clearForm }:AddProducFormType) => {
    const [title, setTitle] = useState<string>('')
    const [disabled, setDisabled] = useState<boolean>(false)
    const [description, setDescription] = useState<string>('');

    const formRef=useRef<HTMLFormElement>(null)

    const handleChange = (event: FormEvent<HTMLTextAreaElement>) => {
        const newValue = event.currentTarget.value;
        if (newValue.length <= 255) {
            setTitle(newValue);
        }
    };

    const handleSubmit=(event:FormEvent<HTMLFormElement>)=>{
        event.preventDefault()
        const data=new FormData(event.currentTarget)
        const photos = data.getAll('photos') as File[]
        if(photos.length > 7){
            setDisabled(true)
           return toast.warn("No more then 6 pictures")
        }
        if (photos.length ===0) {
            setDisabled(true)
            return toast.warn("At least 1 picture must be atach")
        }

        const formData: QueryParamsType = {
            title: data.get('title') as string,
            color: data.get('color') as string,
            price: Number(data.get('price')),
            quantity: Number(data.get('quantity')),
            photos,
            description
        };
        if(!formData.title) {
            setDisabled(false)
            return toast.warn("You must specify  a title")
        }
        if (!formData.color) {
            setDisabled(false)
            return toast.warn("You must specify  a color")
        }
        if (!formData.price) {
            setDisabled(false)
            return toast.warn("You must specify  a price")
        }
        if (!formData.quantity) {
            setDisabled(false)
            return toast.warn("You must specify  a quantity")
        }
        submit(formData)
    }

    useEffect(()=>{
        formRef.current?.reset()
    }, [clearForm])
    useEffect(()=>{
        setDisabled(disabledButton)
    }, [disabledButton])
    return (
        <AddProductFormContainer>
            <form
            onSubmit={handleSubmit}
            ref={formRef}
            >
                <div>
                    <Label>Title</Label>
                    <Textarea
                        id="title"
                        name="title"
                        onChange={handleChange}
                        maxLength={255}
                    />
                    <p>{title.length}/{255} characters</p>
                </div>
                <div className="flex flex-row gap-4">
                    <div className="w-1/3">
                        <Label htmlFor="color">Color</Label>
                        <Input
                        id="color"
                        name="color"
                        placeholder="Color"
                        />
                    </div>
                    <div className="w-1/3">
                        <Label htmlFor="price">Price (RON)</Label>
                        <Input
                        id="price"
                        name="price"
                        placeholder="Price"
                         /></div>
                    <div className="w-1/3">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                        id="quantity"
                        name="quantity"
                        placeholder="Quantity"
                        />
                    </div>
                </div>
                <div className="mt-6">
                <p className="text-center text-xl mb-2">You can edit description of your product how you like</p>
                <TextEditor
                value=""
                onChange={setDescription}
                resetValue={clearForm}
                
                />
                </div>
                <div>
                    <Label htmlFor="photos">Pictures (No more then 6)</Label>
                    <Input 
                    id="photos" 
                    name="photos"
                    type="file" 
                    accept="image/*"
                    multiple
                     
                    />
                </div>
                <div className=" mb-5 mt-5 w-full justify-center flex">
                <ButtonDisabled
                        disabled={disabled}
                >
                    Add new product
                </ButtonDisabled>
                </div>
            </form>
        </AddProductFormContainer>
    );
};

export default AddProductForm;