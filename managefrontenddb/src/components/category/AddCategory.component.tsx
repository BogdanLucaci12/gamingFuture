import { useContext } from "react";
import FormWithOneInput from "../formWithOneInput/FormWithOneInput.component";
import { RegenerateContext } from "@/context/regenerate.context";
import { CategoryBrandSubContainer } from "./Category.styles";

const AddCategory = () => {
    const {refreshCategoriesTable, setRefreshCategoriesTable}=useContext(RegenerateContext)

  const handleRefreshForSuccess=()=>{
    setRefreshCategoriesTable(!refreshCategoriesTable)
  }

  return (
    <CategoryBrandSubContainer>
      <FormWithOneInput
      buttonContent="Add new category"
        url="http://localhost:8626/employee/addCategory"
      description="category"
      title="Category"
      refresh={handleRefreshForSuccess}
      />
    </CategoryBrandSubContainer>
  );
};

export default AddCategory;