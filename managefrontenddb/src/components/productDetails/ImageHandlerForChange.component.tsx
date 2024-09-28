import { toast } from "react-toastify";
import { ChangeImageContainer, ImageContainer } from "../changeProduct/Change.styles";
import { ImageType } from "../changeProduct/ChangeDetailPCQI.component";
import { MdDeleteForever } from "react-icons/md";
import { useEffect, useState } from "react";
import AddImage from "./AddImage.component";
import { useSelectored } from "@/store/hooks";



const ImageHandler = () => {
  const [disabled, setDisabled] = useState<boolean>(false)
  const [images, setImages] = useState<ImageType[]>([])
  const { productDetailId }=useSelectored(state=>state.changeProduct)

  useEffect(() => {
   const fetchImages=async()=>{
     if (!productDetailId) return;
     const response = await fetch(`http://localhost:8626/employee/getImageByDetailId/${productDetailId}`, {
       method: 'get',
       headers: {
         'Content-Type': 'application/json'
       },
       credentials: 'include'
     })
     const statusResponse=await response.json()
     if(statusResponse.error) toast.warn(statusResponse.error)
     setImages(statusResponse)
   }
   fetchImages()
  }, [productDetailId])

  const handleDeleteImage = async (value: number) => {
    //handle delete image
    setDisabled(true)
    const deleteResponse = await fetch(`http://localhost:8626/employee/deleteImageForProductDetail/${value}`, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    //wait for the response
    const dataResponse = await deleteResponse.json()
    if (dataResponse.error) toast.error(dataResponse.error)
    if (dataResponse.success) {
      toast.success(dataResponse.success)
    }
    setDisabled(false)
  }

  return (
    <ChangeImageContainer>
      <ImageContainer>
        {
          images.length ? 
            (
              images.map(({ imageid, imageUrl }: ImageType) =>
                <div key={imageid} className="relative w-[20em] h-[20em]">
                  {
                    !disabled &&
                    <MdDeleteForever
                      className="absolute h-7 w-7 right-0 cursor-pointer hover:transition hover:ease-in-out hover:scale-125"
                      onClick={() => handleDeleteImage(imageid)}
                    />
                  }
                  <img src={imageUrl}
                    alt=""
                    key={imageid}
                  />
                </div>
              )) : (<p className="text-center text-lg font-bold">
                This product doesnt have any images
              </p>)}
      </ImageContainer>
      <AddImage
        imagesArrayLenght={images.length}
      />
    </ChangeImageContainer>
  );
};

export default ImageHandler;