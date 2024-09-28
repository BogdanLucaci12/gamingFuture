import { ChangeEvent, useContext, useEffect, useState } from "react";
import { CategoryBrandSubContainer } from "../category/Category.styles";
import { RegenerateContext } from "@/context/regenerate.context";
import { Input } from "../ui/input";
import { IoGameController } from "react-icons/io5";
export type BrandsType = {
    brand: string,
}
const ShowBrand = () => {
    const [brands, setBrands] = useState<BrandsType[]>([])
    const [filter, setFilter] = useState<BrandsType[]>([])
    const { refreshBrandsTable } = useContext(RegenerateContext)
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("http://localhost:8626/employee/getBrands", {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            })
            const data = await response.json() as BrandsType[]
            setFilter(data)
            setBrands(data)
        }
        fetchData()
    }, [refreshBrandsTable])

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value
        const newArrayCategory = brands.filter(brand =>
            brand.brand.toLowerCase().includes(value)
        )
        setFilter(newArrayCategory)
    }

  return (
      <CategoryBrandSubContainer>
          <div className="text-lg font-medium">
              <p className="text-center m-2 border-b-2 border-black">List with all brand</p>
          </div>
          <div className="max-h-80 overflow-y-auto">
          <table className="w-full">
              <thead>
                  <tr className="border-b-2 border-black">
                      <th className="text-center">Brand</th>
                  </tr>
              </thead>
              <tbody>
                  { filter.length ?
                      filter.map(({ brand }: BrandsType, index) => (
                          <tr key={index} className={`${index % 2 === 0 ? 'bg-slate-200' : 'white'}`}>
                              <td className="text-center">{brand}</td>
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
              placeholder="Search brand"
              className="mt-2 mb-2  border-black"
              onChange={handleSearch}
          />

      </CategoryBrandSubContainer>
  );
};

export default ShowBrand;