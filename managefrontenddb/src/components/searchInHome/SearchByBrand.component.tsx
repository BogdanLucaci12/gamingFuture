import { useEffect, useState } from "react";
import { BrandsType } from "../brand/ShowBrand.component";
import { toast } from "react-toastify";
import { ProductType } from "@/pages/home/Home.page";
import { useSelectored } from "@/store/hooks";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";

type SearchByBrandType = {
  setAllProducts: (value: ProductType[]) => void
}


const SearchByBrand = ({ setAllProducts }: SearchByBrandType) => {
  const [brands, setBrands] = useState<string[]>([])
  const [modifiedSelectValueForBrand, setModifiedSelectValueForBrand] = useState<string>('')
  const { categoryHomeState, subCategoryHomeState, brandHomeState } = useSelectored(state => state.home)
  useEffect(() => {
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
  const handleSelectedBrand = async (value: string) => {
    setAllProducts([])
    setModifiedSelectValueForBrand(value)
    //query product by brand
    const response = await fetch(`http://localhost:8626/employee/getProductByBrand?brand=${value}&category=${categoryHomeState}&subcategory=${subCategoryHomeState}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/ json'
      },
      credentials: 'include'
    })
    const dataResponse = await response.json()
    if (dataResponse.error) {
      setAllProducts([])
      return toast.error(dataResponse.error)
    }
    setAllProducts(dataResponse)
  }

  useEffect(() => {
    setModifiedSelectValueForBrand('')
  }, [brandHomeState])

  return (
    <div>
      <Select
        onValueChange={(value) => handleSelectedBrand(value)}
        value={modifiedSelectValueForBrand}
      >
        <Label>Select brand</Label>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Brands" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Brands</SelectLabel>
            {brands.length &&
              brands.map(val =>
                <SelectItem
                  key={val}
                  value={val}
                  className="cursor-pointer"
                >{val}</SelectItem>
              )
            }
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchByBrand;