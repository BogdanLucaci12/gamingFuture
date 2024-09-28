
import { useState } from "react";
import { AddProductPageContainer, SelectContainerAddProductPage } from "./AddProductPage.styles";
import AddProductForm, { QueryParamsType } from "@/components/addProductForm/AddProducForm.component";
import { toast } from "react-toastify";
import SelectCategory from "@/components/category/SelectCategory.component";
import SelectBrand from "@/components/brand/SelectBrand.component";

type SendRequestType = {
  category:string,
  subCategory:string,
  brand:string
}


const AddProductPage = () => {

  const [disabled, setDisabled] = useState<boolean>(false)
  //define a variables that store some parametries that would be sent throw http rewuest body
  const [queryParams, setQueryParams] = useState<SendRequestType>({ category: "", subCategory: "", brand:""})
  const [clearForm, setClearForm]=useState<boolean>(false)

 
    //Setam valoarea de la category dupa click

  const handleSubmit=async(formData:QueryParamsType)=>{
    const { category,  subCategory, brand } = queryParams
    if (!category)  return toast.warn("You must specify  a category")

    if (!subCategory) return toast.warn("You must specify  a subcategory")

    if (!brand) return toast.warn("You must specify  a brand")

    setDisabled(true)
    //Create a new object formData to include photo too
    const formDataToSend = new FormData();

    formDataToSend.append("title", formData.title);
    formDataToSend.append("color", formData.color);
    formDataToSend.append("price", formData.price.toString());
    formDataToSend.append("quantity", formData.quantity.toString());
    formDataToSend.append("category", category);
    formDataToSend.append("subCategory", subCategory);
    formDataToSend.append("brand", brand);
    formDataToSend.append("description", formData.description);

    // Adăugarea fișierelor în FormData
    formData.photos.forEach((photo) => {
      formDataToSend.append("photos", photo); 
    });

    const response = await fetch("http://localhost:8626/employee/addProduct", {
      method: 'post',
      credentials:"include",
      body: formDataToSend,
    })
    const dataReponse=await response.json()
    //Check error response
    if(dataReponse.error)toast.error(dataReponse.error)
      //Check success reponse
    if(dataReponse.success){
      setClearForm(!clearForm)
      toast.success(dataReponse.success)}
      setDisabled(false)
      
  }

  return (
    <AddProductPageContainer>
      <div>
        <p className="text-xl">Insert a new product</p>
        </div>
      <SelectContainerAddProductPage>
      <SelectCategory
          sendCategory={(value) => setQueryParams({ ...queryParams, category: value })}
          sendSubcategory={(value) => setQueryParams({ ...queryParams, subCategory: value })}
      />
      <SelectBrand
          sendBrand={(value) => setQueryParams({ ...queryParams, brand: value })}
      />
      </SelectContainerAddProductPage>
      <AddProductForm
        submit={handleSubmit}
        disabledButton={disabled}
        clearForm={clearForm}
      />
    </AddProductPageContainer>
  );
};

export default AddProductPage;