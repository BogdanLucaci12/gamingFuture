
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import ButtonDisabled from "../button/ButtonDisabled.component";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "react-toastify";
import { useSelectored } from "@/store/hooks";
import { RegenerateContext } from "@/context/regenerate.context";

type AddImageProps={
    imagesArrayLength:number
}

const AddImageForChangeProduct = ({ imagesArrayLength }:AddImageProps) => {

    const [sendimages, setSendImages] = useState<File[]>([]);
    const [disabled, setDisabled] = useState<boolean>(false)
    const [maxNumberOfPhotos, setMaxNumberOfPhoto]=useState<boolean>(false)
    const [acceptedNumberOfPhoto, setAcceptedNumberOfPhoto]=useState<number>(0)
    const { productDetailId }=useSelectored(state=>state.changeProduct)
    const { setRefreshImageDetail, refreshImageDetail }=useContext(RegenerateContext)

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        //store new inserted images by user in images array for sending to backend
        if (event.target.files) {
            const newFiles = Array.from(event.target.files);
            setSendImages((prevImages) => [...prevImages, ...newFiles]);
        }
    }

    useEffect(() => {
        if (sendimages.length + imagesArrayLength >= 6) {
            setMaxNumberOfPhoto(true);
        } else {
            setMaxNumberOfPhoto(false);
            setAcceptedNumberOfPhoto(6 - sendimages.length - imagesArrayLength);
        }
    }, [imagesArrayLength, sendimages]);

    
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
    setRefreshImageDetail(!refreshImageDetail)
    setSendImages([])
    setDisabled(false)
};


return (
    <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2"
    >
        {imagesArrayLength <=6 ? 
        
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
        />
           </>
    )
        }
        <ButtonDisabled
            disabled={disabled}
            className="w-[14em]"
        >
            Submit new image
        </ButtonDisabled>
        </>  :
        <p>You can not insert image</p>   
    }

    </form>
);
};

export default AddImageForChangeProduct;