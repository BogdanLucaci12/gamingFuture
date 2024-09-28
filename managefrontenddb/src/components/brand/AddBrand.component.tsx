import { useContext } from "react";
import { CategoryBrandSubContainer } from "../category/Category.styles";
import FormWithOneInput from "../formWithOneInput/FormWithOneInput.component";
import { RegenerateContext } from "@/context/regenerate.context";

const ComponentName = () => {
    const {setRefreshBrandsTable, refreshBrandsTable}=useContext(RegenerateContext)

    const handleRefreshForSuccess = ()=>{
        setRefreshBrandsTable(!refreshBrandsTable)
    }
  return (
      <CategoryBrandSubContainer>
          <FormWithOneInput
              buttonContent="Add new brand"
              url="http://localhost:8626/employee/addBrand"
              description="brand"
              title="Brand"
              refresh={handleRefreshForSuccess}
          />
      </CategoryBrandSubContainer>
  );
};

export default ComponentName;