import { FormEvent, useState, useRef } from "react";
import ButtonDisabled from "../button/ButtonDisabled.component";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "react-toastify";

type FormWithOneInputProps = {
    buttonContent: string,
    url: string,
    description: string,
    title: string,
    refresh:()=>void
}

const FormWithOneInput = ({ buttonContent, url, description, title, refresh }: FormWithOneInputProps) => {
    const [disabled, setDisabled] = useState<boolean>(false)
    const form = useRef<HTMLFormElement>(null)
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setDisabled(true)
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData)
        const descriptionValue = data[description]
        const response = await fetch(url, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
          
            body: JSON.stringify({
                [description]: descriptionValue
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

    return (
        <div className="w-[100%]">
            <div className="text-lg font-medium">
                <p className="text-center border-b-2 border-black">Add new {description}</p>
            </div>
            <form action="" className="m-5" onSubmit={handleSubmit} ref={form}>
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
                        className=""
                    >
                        {buttonContent}
                    </ButtonDisabled>
                </div>
            </form>
        </div>
    );
};

export default FormWithOneInput;