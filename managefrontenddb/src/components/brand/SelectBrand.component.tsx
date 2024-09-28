import { useEffect, useState } from "react";
import SelectDemo from "../selectComponent/Select.component";
import { BrandsType } from "./ShowBrand.component";

type SelectBrandType={
  sendBrand:(value:string)=>void
}

const SelectBrand = ({sendBrand}:SelectBrandType) => {
  const [brands, setBrands] = useState<string[]>([])

  useEffect(()=>{
    const fetchDataBrands = async () => {
      const response = await fetch("http://localhost:8626/employee/getBrands", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      })
      const data = await response.json() as BrandsType[]
      const convertInArray = data.map(({ brand }: BrandsType) => brand)
      setBrands(convertInArray)
    }

    fetchDataBrands()
  }, [])
  
  const handleSelectedBrand = (value: string) => {
   sendBrand(value)
  }

  return (
    <div>
      <SelectDemo
        values={brands}
        handleSelectedValue={handleSelectedBrand}
        label="Brands"
        placeholderText="Select brand"
      />
    </div>
  );
};

export default SelectBrand;