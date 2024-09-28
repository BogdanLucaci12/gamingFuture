import AddCategory from "./AddCategory.component";
import AddSubcategory from "./AddSubcategory.component";
import { CategoryBrandContainer } from "./Category.styles";
import ShowCategory from "./ShowCategory.component";

const Category = () => {
    return (
        <CategoryBrandContainer>
            
            <ShowCategory/>
            <AddCategory/>
            <AddSubcategory/>
        </CategoryBrandContainer>
    );
};

export default Category;