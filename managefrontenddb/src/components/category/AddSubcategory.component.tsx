import { useContext } from "react";
import FormWithOneInputAndSelect from "../formWithOneInput/FormWithOneInputAndSelect.component";
import { RegenerateContext } from "@/context/regenerate.context";
import { CategoryBrandSubContainer } from "./Category.styles";

const AddSubcategory = () => {
    const {setRefreshCategoriesTable, refreshCategoriesTable}=useContext(RegenerateContext)

    const handleRefresh = ()=>{
        setRefreshCategoriesTable(!refreshCategoriesTable)
    }

  return (
    <CategoryBrandSubContainer>
          <FormWithOneInputAndSelect 
          url="http://localhost:8626/employee/addSubCategory"
          buttonContent="Add new subcategory"
          description="subcategory"
          title="Subcategory"
          refresh={handleRefresh}
          />
    </CategoryBrandSubContainer>
  );
};

export default AddSubcategory;