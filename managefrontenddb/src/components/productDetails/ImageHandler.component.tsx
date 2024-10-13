import { toast } from "react-toastify";
import { ChangeImageContainer, ImageContainer } from "../changeProduct/Change.styles";
import { ImageType } from "../changeProduct/ChangeDetailPCQI.component";
import { MdDeleteForever } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import { useSelectored } from "@/store/hooks";
import { RegenerateContext } from "@/context/regenerate.context";
import AddImageForChangeProduct from "./AddImageForChangeProduct.component";



const ImageHandler = () => {
  const [disabled, setDisabled] = useState<boolean>(false)
  const [images, setImages] = useState<ImageType[]>([])
  const { productDetailId }=useSelectored(state=>state.changeProduct)
  const { setRefreshImageDetail, refreshImageDetail }=useContext(RegenerateContext)

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
     if(statusResponse.error) return toast.warn(statusResponse.error)
     setImages(statusResponse)
   }
   fetchImages()
  }, [productDetailId, refreshImageDetail])

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
    if (dataResponse.error) { 
      setDisabled(false) 
      return toast.error(dataResponse.error)}
    setImages(dataResponse)
    setDisabled(false)
    setRefreshImageDetail(!refreshImageDetail)
  }
  return (
    <ChangeImageContainer>
      <ImageContainer>
        {
          images.length ? 
            (
              images.map(({ imageid, imageurl }: ImageType) =>
                <div key={imageid} className="relative flex">
                  {
                    !disabled &&
                    <MdDeleteForever
                      className="absolute h-7 w-7 right-0 cursor-pointer hover:transition hover:ease-in-out hover:scale-125 bg-white rounded-lg"
                      onClick={() => handleDeleteImage(imageid)}
                    />
                  }
                  <img src={imageurl}
                    alt=""
                    key={imageid}
                  />
                </div>
              )) : (<p className="text-center text-lg font-bold">
                This product doesnt have any images
              </p>)}
      </ImageContainer>
      <AddImageForChangeProduct
        imagesArrayLength={images.length}
      />
    </ChangeImageContainer>
  );
};

export default ImageHandler;