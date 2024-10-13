import { IoMdClose } from "react-icons/io";
import { useDispatcher, useSelectored } from "@/store/hooks";
import { setActive, setAddDetail } from "@/store/overlaySlice";
import { Fragment } from "react/jsx-runtime";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import ButtonDisabled from "../button/ButtonDisabled.component";
import { ChangeEvent, FormEvent, useEffect, useState, useRef, useContext } from "react";
import { toast } from "react-toastify";
import { RegenerateContext } from "@/context/regenerate.context";

const AddDetail = () => {
  const [disabled, setDisabled] = useState<boolean>(false)
  const [sendimages, setSendImages] = useState<File[]>([]);
  const [maxNumberOfPhotos, setMaxNumberOfPhoto] = useState<boolean>(false)
  const [acceptedNumberOfPhoto, setAcceptedNumberOfPhoto] = useState<number>(0)
  const { refreshDetails, setRefreshDetails } = useContext(RegenerateContext)
  const { productId } = useSelectored(state => state.changeProduct)
  const form = useRef<HTMLFormElement>(null)
  const dispatch = useDispatcher()

  const handleCloseContainer = () => {
    dispatch(setActive(false))
    dispatch(setAddDetail(false))
  }

  useEffect(() => {
    if (sendimages.length >= 6) {
      setMaxNumberOfPhoto(true);
    } else {
      setMaxNumberOfPhoto(false);
      setAcceptedNumberOfPhoto(6 - sendimages.length);
    }
  }, [sendimages]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    //store new inserted images by user in images array for sending to backend
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setSendImages((prevImages) => [...prevImages, ...newFiles]);
    }
  }

  const handleSubmitNewDetail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setDisabled(true)

    const takeDataInsertedByUsserInForm = new FormData(event.currentTarget);

    const sendFormData = new FormData()
    sendFormData.append("color", takeDataInsertedByUsserInForm.get('color') as string)
    sendFormData.append("price", takeDataInsertedByUsserInForm.get('price') ?? '')
    sendFormData.append("quantity", takeDataInsertedByUsserInForm.get('quantity') ?? '')
    
    sendimages.forEach((photo) => {
      sendFormData.append("photos", photo);
    });


    const reponse = await fetch(`http://localhost:8626/employee/addDetailForProduct/${productId}`, {
      method: "post",
      credentials: "include",
      body: sendFormData
    })
    const statusReponse = await reponse.json()
    if (statusReponse.error) toast.error(statusReponse.error)
    if (statusReponse.success) {
      form.current?.reset()
      toast.success(statusReponse.success)
      setRefreshDetails(!refreshDetails)
    }
    setDisabled(false)
  }

  return (
    <Fragment>
      <p className="border-b-2">Add new detail</p>
      <IoMdClose
        className="absolute right-0 m-1 w-10 h-10 hover:rotate-180	hover:ease-in-out cursor-pointer duration-500"
        onClick={handleCloseContainer}
      />
      <form action=""
        className="flex flex-col gap-2"
        onSubmit={handleSubmitNewDetail}
        ref={form}
      >
        <div className="flex flex-row gap-4  max735:flex-col">
          <div className="w-1/3 max735:w-[15em]">
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              name="color"
              placeholder="Color"
            />
          </div>
          <div className="w-1/3 max735:w-[15em]">
            <Label htmlFor="price">Price (RON)</Label>
            <Input
              id="price"
              name="price"
              placeholder="Price"
            /></div>
          <div className="w-1/3 max735:w-[15em]">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              placeholder="Quantity"
            />
          </div>
        </div>
        <div>
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
                    className="w-[25em] max735:w-[15em]"
                  />
                </>
              )
          }
        </div>
        <ButtonDisabled
          disabled={disabled}
          className="w-[10em]"
        >
          Submit detail
        </ButtonDisabled>
      </form>
    </Fragment>
  );
};

export default AddDetail;