import { Input } from "@/components/ui/input";
import { HomeContainer, ShowProduct } from "./Home.styles";
import SearchByCategory from "@/components/searchInHome/SearchByCategory.component";
import SearchByBrand from "@/components/searchInHome/SearchByBrand.component";
import { Label } from "@/components/ui/label";
import { useContext, useEffect, useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import ProductCard from "@/components/productCard/ProductCard.component";
import ButtonDisabled from "@/components/button/ButtonDisabled.component";
import { IoGameController } from "react-icons/io5";
import { RegenerateContext } from "@/context/regenerate.context";

export type ProductType={

  image: string,
  title: string,
  category: string,
  subcategory: string,
  brand: string,
  id: number
}

const Home = () => {
    const [allProducts, setAllProducts]=useState<ProductType[]>([])
    const [disabledSearch, setDisabledSearch]=useState<boolean>(false)
    const {refreshProductsHome}=useContext(RegenerateContext)
  useEffect(()=>{
    //query db for all product
    const fetchProduct=async()=>{
      const response = await fetch("http://localhost:8626/employee/getDistinctProducts", {
        method:"get",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:"include"
      })
      const dataResponse=await response.json()
      if(dataResponse.error) return toast.error(dataResponse.error)
      setAllProducts(dataResponse)
    }
    fetchProduct()
  }, [refreshProductsHome])

  const handleSearch = async ( event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault()
    setAllProducts([])
    setDisabledSearch(true)
    const formData=new FormData(event.currentTarget)
    const data=Object.fromEntries(formData)
    const {search}=data
    const response = await fetch(`http://localhost:8626/employee/getProductBySearch?searchParam=${search}`,{
      method:'get',
      headers:{
        'Content-Type': 'application/ json'
      },
      credentials:'include'
    })
    const dataResponse=await response.json()
    if (dataResponse.error) return toast.error(dataResponse.error)
    setAllProducts(dataResponse)
    setDisabledSearch(false)
  }

  return (
    <HomeContainer>
        <div className="flex max610:flex-col justify-start gap-4">
      <SearchByCategory
          setAllProducts={(value) => setAllProducts(value)}
      />
      <SearchByBrand
          setAllProducts={(value) => setAllProducts(value)}
      />
      </div>
      <div className="w-1/2 max735:w-full">
      <form onSubmit={handleSearch}>
        <Label htmlFor="search">Search product</Label>
        <div className="w-full flex items-center gap-3">
        <Input
        id="search"
        name="search"
        placeholder="Search product, brand, category, subcategory"
        />
        <ButtonDisabled
        disabled={disabledSearch}
        className="w-[9em]"
            >Search</ButtonDisabled>
        </div>
      </form>
      </div>
      <ShowProduct>
        {
          allProducts.length ? 
          allProducts.map(({image, category, subcategory, id, title, brand}:ProductType)=>
          <ProductCard
          key={id}
          image={image}
          title={title}
          category={category}
          subcategory={subcategory}
          brand={brand}
          id={id}
          />
          )
            : <IoGameController className="animate-pulse self-center w-[5em] h-[5em]"/>
        }
      </ShowProduct>
    </HomeContainer>
  );
};

export default Home;