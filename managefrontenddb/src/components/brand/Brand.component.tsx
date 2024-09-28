import { CategoryBrandContainer } from "../category/Category.styles";
import ShowBrand from "./ShowBrand.component";
import AddBrand from './AddBrand.component'

const Brand = () => {
  return (
    <CategoryBrandContainer>
      <ShowBrand/>
      <AddBrand/>
    </CategoryBrandContainer>
  );
};

export default Brand;