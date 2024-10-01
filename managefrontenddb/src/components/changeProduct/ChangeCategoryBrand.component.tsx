
import ButtonDisabled from '@/components/button/ButtonDisabled.component'
import SelectBrand from "@/components/brand/SelectBrand.component";
import SelectCategory from "@/components/category/SelectCategory.component";
import { useContext, useState } from 'react';
import { ChangeBrandCategoryContainer } from './ChangeProductComponent.style';
import { toast } from 'react-toastify';
import { RegenerateContext } from '@/context/regenerate.context';

type UpdatePayloadType = {
    newBrand: string,
    newCategory: string,
    newSubcategory: string
}

type ChangeBrandCategoryType = {
    brand: string,
    category: string,
    subcategory: string,
    productId: number
}

const ChangeBrandCategory = ({ brand, category, subcategory, productId }: ChangeBrandCategoryType) => {
    const { setRefreshProduct, refreshProduct } = useContext(RegenerateContext)
    const [updatePayload, setUpdatePayload] = useState<UpdatePayloadType>({
        newBrand: '',
        newCategory: '',
        newSubcategory: ''
    })
    const [disabled, setDisabled] = useState<boolean>(false)
    const { newBrand, newCategory, newSubcategory } = updatePayload
    const handleSelectedBrand = (value: string) => {
        setUpdatePayload({ ...updatePayload, newBrand: value })
    }

    const handleSelectedCategory = (value: string) => {
        setUpdatePayload({ ...updatePayload, newCategory: value })
    }

    const handleSelectedSubcategory = (value: string) => {
        setUpdatePayload({ ...updatePayload, newSubcategory: value })
    }

    const handleClick = async () => {
        setDisabled(true)
        const response = await fetch(`http://localhost:8626/employee/updateBrandCategorySubcategory/${productId}`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                brand: newBrand,
                category: newCategory,
                subcategory: newSubcategory
            })
        })
        const data = await response.json()
        if (data.error) toast.error(data.error)
        if (data.success) {
            setRefreshProduct(!refreshProduct)
            toast.success(data.success)
        }
        setDisabled(false)
    }
    return (
        <ChangeBrandCategoryContainer >
            <div className="w-52">
                <p>
                    <b>Category:</b> {category}</p>
                <p>
                    <b>Subcategory: </b>  {subcategory}</p>
                <p>
                    <b>  Brand:</b> {brand}
                </p>
            </div>
            <div className='flex flex-col gap-3'>
                <div className="flex gap-5 max428:flex-col">
                    <SelectCategory
                        sendCategory={handleSelectedCategory}
                        sendSubcategory={handleSelectedSubcategory}
                    />
                    <SelectBrand
                        sendBrand={handleSelectedBrand}
                    />
                </div>
                    <ButtonDisabled
                        disabled={disabled}
                    className='w-[13em]'
                    >
                        Submit new changes
                    </ButtonDisabled>
            </div>
        </ChangeBrandCategoryContainer>
    );
};

export default ChangeBrandCategory;