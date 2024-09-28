
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import ButtonDisabled from "../button/ButtonDisabled.component";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "react-toastify";
import { useSelectored } from "@/store/hooks";

type AddImageProps={
    imagesArrayLenght:number
}

const AddImage = ({imagesArrayLenght}:AddImageProps) => {

    const [sendimages, setSendImages] = useState<File[]>([]);
    const [disabled, setDisabled] = useState<boolean>(false)
    const [maxNumberOfPhotos, setMaxNumberOfPhoto]=useState<boolean>(false)
    const [acceptedNumberOfPhoto, setAcceptedNumberOfPhoto]=useState<number>(0)
    const { productDetailId }=useSelectored(state=>state.changeProduct)
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        //store new inserted images by user in images array for sending to backend
        if (event.target.files) {
            setSendImages(Array.from(event.target.files));
        }
    }

    useEffect(()=>{
        sendimages.length + imagesArrayLenght > 6 ? setMaxNumberOfPhoto(true) : setMaxNumberOfPhoto(false);
        setAcceptedNumberOfPhoto(6 - sendimages.length + imagesArrayLenght)
    }, [sendimages])

const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDisabled(true)
    const formData = new FormData();
    sendimages.forEach((image) => {
        formData.append("photos", image); 
    });
    const reponse = await fetch(`http://localhost:8626/employee/addImageForProductDetail/${productDetailId}`, {
        method: "POST",
        credentials: "include",
        body: formData
    })
    const dataResponse = await reponse.json()
    if (dataResponse.error) toast.error(dataResponse.error)
    if (dataResponse.success) {
        toast.success(dataResponse.success)
    }
    setDisabled(false)

};


return (
    <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2"
    >
        {imagesArrayLenght <=6 ? 
        
        <>
        {
                    maxNumberOfPhotos ? (<p>You have reached the max number of photos for a detail</p>) :
           (   
           <>
           <Label htmlFor="photos">Pictures (No more then {acceptedNumberOfPhoto})</Label>
        <Input
            id="photos"
            name="photos"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="w-[25em]"
        />
           </>
    )
        }
        <ButtonDisabled
            disabled={disabled}
            className=""
        >
            Submit new image
        </ButtonDisabled>
        </>  :
        <p>You can not insert image</p>   
    }

    </form>
);
};

export default AddImage;