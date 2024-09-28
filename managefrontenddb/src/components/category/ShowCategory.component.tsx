import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { RegenerateContext } from "@/context/regenerate.context";
import { CategoryBrandSubContainer } from "./Category.styles";
import { IoGameController } from "react-icons/io5";


export type CategoryType = {
    category: string,
    subcategory: string
}

const ShowCategory = () => {
    const [categories, setCategories] = useState<CategoryType[]>([])
    const [filter,setFilter]=useState<CategoryType[]>([])
    const {refreshCategoriesTable}=useContext(RegenerateContext)
    
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("http://localhost:8626/employee/getCategoriesAndSubcategory", {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            })
            const data = await response.json() as CategoryType[]
            setFilter(data)
            setCategories(data)
        }
        fetchData()
    }, [refreshCategoriesTable])

    const handleSearch=(e:ChangeEvent<HTMLInputElement>)=>{
        const value=e.currentTarget.value
        const newArrayCategory = categories.filter(category=>
            category.category.toLowerCase().includes(value) || category.subcategory.toLowerCase().includes(value)
        )
        setFilter(newArrayCategory)
    }
    return (
        <CategoryBrandSubContainer>
            <div className="text-lg font-medium">
                <p className="text-center m-2 border-b-2 border-black">List with all category and subcategory</p>
            </div>
            <div className="max-h-80 overflow-y-auto ">
            <table className="w-full">
                <thead>
                    <tr className="border-b-2 border-black">
                        <th className="text-center">Category</th>
                        <th className="text-center">Subcategory</th>
                    </tr>
                </thead>
                <tbody>
                    { filter.length ?
                        filter.map(({ category, subcategory }: CategoryType, index) => (
                            <tr key={index} className={`${index % 2 === 0 ? 'bg-slate-200' : 'white'} h-2`}>
                                <td className="text-center">{category}</td>
                                <td className="text-center">{subcategory}</td>
                            </tr>
                        ))
                           : <IoGameController className="animate-pulse self-center w-[5em] h-[5em]" />

                    }
                </tbody>
            </table>
            </div>
            <Input 
            type="text" 
            name="search"
            placeholder="Search category or subcategory"
            className="mt-2 mb-2  border-black"
            onChange={handleSearch}
            />

        </CategoryBrandSubContainer>
    );
};

export default ShowCategory;