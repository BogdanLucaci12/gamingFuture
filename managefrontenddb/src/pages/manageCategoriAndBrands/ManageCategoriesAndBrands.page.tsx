import Brand from "@/components/brand/Brand.component";
import Category from "@/components/category/Category.component";
import { ManageCategoriesAndBrandsContainer } from "./ManageCategoriesAndBrands.styles";

const ManageCategoriesAndBrands = () => {
  return (
    <ManageCategoriesAndBrandsContainer>
          <Category/>
          <Brand/>
    </ManageCategoriesAndBrandsContainer>
  );
};

export default ManageCategoriesAndBrands;