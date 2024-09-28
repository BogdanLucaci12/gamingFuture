import { useEffect, useState } from "react";
import SelectDemo from "../selectComponent/Select.component";
import { CategoryType } from "./ShowCategory.component";

type SelectCategoryType={
    sendCategory:(value:string)=>void,
    sendSubcategory:(value:string)=>void
}

const SelectCategory = ({ sendCategory, sendSubcategory }:SelectCategoryType) => {
    const [categories, setCategories] = useState<string[]>([])
    const [nativeCategories, setNativeCategories] = useState<CategoryType[]>([])
    const [subcategories, setSubcategories] = useState<string[]>([])
    const [selectedCategory, setSelectedCategory]=useState<string>()

    useEffect(() => {
        //request categories
        const fetchDataCategories = async () => {
            const response = await fetch("http://localhost:8626/employee/getCategoriesAndSubcategory", {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            })
            const data = await response.json() as CategoryType[]
            setNativeCategories(data)
            const dataCategory = data.map(cat => cat.category)
            const uniqueValues = [...new Set(dataCategory)];
            setCategories(uniqueValues)
        }
        fetchDataCategories()
    }, [])




    const handleSelectedCategory = (value: string) => {
        //find in categoryType every subcategory that mathces whit category
        sendCategory(value)
        setSelectedCategory(value)
        const filterDataByCategory = nativeCategories.filter((cat: CategoryType) =>
            cat.category === value
        )
        //map through array object then retrieve only subcategory
        const subCategories = filterDataByCategory.map(({ subcategory }: CategoryType) => subcategory)
        setSubcategories(subCategories)
    }


    const handleSelectedSubCategory = (value: string) => {
        sendSubcategory(value)
    }

  return (
      <div className="flex flex-row gap-5 max610:flex-col">
              <SelectDemo
                  values={categories}
                  handleSelectedValue={handleSelectedCategory}
                  label="Categories"
                  placeholderText="Select category"
              />
              <SelectDemo
                  values={subcategories}
                  handleSelectedValue={handleSelectedSubCategory}
                  label="Subcategories"
                  placeholderText={`${selectedCategory ? `Select subcategory` : `First select a category`}`}
              />
    </div>
  );
};

export default SelectCategory;