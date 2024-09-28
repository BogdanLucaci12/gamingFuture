import { FormEvent, useState, useRef, useEffect } from "react";
import ButtonDisabled from "../button/ButtonDisabled.component";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "react-toastify";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type FormWithOneInputAndSelectProps = {
    buttonContent: string,
    url: string,
    description: string,
    title: string,
    refresh: () => void
}

type CategoriesType = {
    category: string
}
const FormWithOneInputAndSelect = ({ buttonContent, url, description, title, refresh }: FormWithOneInputAndSelectProps) => {
    const [disabled, setDisabled] = useState<boolean>(false)
    const [categories, setCategories] = useState<CategoriesType[]>([])
    const form = useRef<HTMLFormElement>(null)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setDisabled(true)
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData)
        const descriptionValue = data[description]
        if (!descriptionValue) {
            setDisabled(false)
            return toast.warn(`No ${description} provided`)
        }
        if (!selectedCategory) {
            setDisabled(false)
            return toast.warn("No category selected")
        }
        const response = await fetch(url, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",

            body: JSON.stringify({
                [description]: descriptionValue,
                category: selectedCategory
            })
        })
        const dataResponse = await response.json()
        if (dataResponse.error) toast.error(dataResponse.error)
        if (dataResponse.success) {
            toast.success(dataResponse.success)
            refresh()
        }
        setDisabled(false)
        form.current?.reset()
    }

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("http://localhost:8626/employee/getCategories", {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            })
            const dataResponse = await response.json() as CategoriesType[]
            setCategories(dataResponse)
        }
        fetchData()
    }, [])

    return (
        <div className="w-full">
            <div className="text-lg font-medium">
                <p className="text-center border-b-2 border-black">Add new {description}</p>
            </div>
            <div className="w-full flex justify-center items-center mt-5 gap-4">
                <Select onValueChange={(value) => setSelectedCategory(value)}>
                    <Label>Select a category</Label>
                    <SelectTrigger className="w-1/2">
                        <SelectValue placeholder="Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map(({ category }: CategoriesType) =>
                            <SelectItem
                                value={category}
                                key={category}
                            >{category}</SelectItem>
                        )}
                    </SelectContent>
                </Select>
            </div>
            <form action="" className="m-5 " onSubmit={handleSubmit}>
                <div>
                    <Label htmlFor={description}>{title}</Label>
                    <Input
                        id={description}
                        name={description}
                        placeholder={`Insert a new  ${description}`}
                    />
                </div>
                <div className="mt-3">
                    <ButtonDisabled
                        disabled={disabled}
                    >
                        {buttonContent}
                    </ButtonDisabled>
                </div>
            </form>

        </div>
    );
};

export default FormWithOneInputAndSelect;