import { useEffect, useState } from "react";
import { CategoryType } from "../category/ShowCategory.component";
import SelectDemo from "../selectComponent/Select.component";
import { toast } from "react-toastify";
import { ProductType } from "@/pages/home/Home.page";
import { useDispatcher, useSelectored } from "@/store/hooks";
import { setBrandHomeState, setCategoryHomeState, setSubcategoryHomeState } from "@/store/homeSlice";

type SearchByCategoryType = {
    setAllProducts: (value: ProductType[]) => void
}

const SearchByCategory = ({ setAllProducts }: SearchByCategoryType) => {

    const [categories, setCategories] = useState<string[]>([])
    const [nativeCategories, setNativeCategories] = useState<CategoryType[]>([])
    const [subcategories, setSubcategories] = useState<string[]>([])
    const [category, setCategory] = useState<string>('')
    const { categoryHomeState, brandHomeState } = useSelectored(state => state.home)
    const dispatch = useDispatcher()
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

    const handleSelectedCategory = async (value: string) => {
        //store selected cateogry in category state
        setCategory(value)
        dispatch(setCategoryHomeState(value))
        dispatch(setBrandHomeState(!brandHomeState))
        //find in categoryType every subcategory that matches whit category
        const filterDataByCategory = nativeCategories.filter((cat: CategoryType) =>
            cat.category === value
        )
        const subCategories = filterDataByCategory.map(({ subcategory }: CategoryType) => subcategory)
        setSubcategories(subCategories)
        const response = await fetch(`http://localhost:8626/employee/getProductByCategory?category=${value}`, {
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
    const handleSelectedSubCategory = async (value: string) => {
        //query product by subcategory
        setAllProducts([])
        dispatch(setSubcategoryHomeState(value))
        const response = await fetch(`http://localhost:8626/employee/getProductBySubcategory?subcategory=${value}&category=${categoryHomeState}`, {
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
    return (
        <div className="flex gap-4 max428:flex-col">
            <div>
                <SelectDemo
                    values={categories}
                    handleSelectedValue={handleSelectedCategory}
                    label="Categories"
                    placeholderText="Select category"
                />
            </div>
            <div>
                <SelectDemo
                    values={subcategories}
                    handleSelectedValue={handleSelectedSubCategory}
                    label="Subcategories"
                    placeholderText={`${category ? `Select subcategory` : `First select a category`}`}
                />
            </div>
        </div>
    );
};

export default SearchByCategory;