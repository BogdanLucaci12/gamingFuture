import { Label } from "@/components/ui/label";
import { SettingsContainer, SettingsSubContainer } from "./Settings.styled";
import { Input } from "@/components/ui/input";
import ButtonDisabled from "@/components/button/ButtonDisabled.component";
import { FormEvent, useRef, useState } from "react";
import { toast } from "react-toastify";

type FormType={
  username:string,
  password:string,
  newpassword:string,
  confirmnewpassword:string
}

const Settings = () => {
  const form = useRef<HTMLFormElement>(null)
  const [disabled, setDisabled]=useState<boolean>(false)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setDisabled(true)
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as FormType
    const {username, password, newpassword, confirmnewpassword}=data
    if(!username) {
      setDisabled(false)
      return toast.warn("No username provided")
    }
    if (!password) {
      setDisabled(false)
      return toast.warn("No password provided")
    }
    if (!newpassword) {
      setDisabled(false)
      return toast.warn("No new password provided")
    }
    if (!confirmnewpassword) {
      setDisabled(false)
      return toast.warn("No confirm new password provided")
    }
    if(confirmnewpassword !== newpassword){
      setDisabled(false)
      return toast.warn("New password is not the same as confirm new password")
    }
    const response = await fetch("http://localhost:8626/employee/updatePasswordEmployee", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username, password, newpassword, confirmnewpassword
      })
    })
    const dataResponse = await response.json()
    if (dataResponse.error) toast.error(dataResponse.error)
    if (dataResponse.success) {
      toast.success(dataResponse.success)

    }
    setDisabled(false)
    form.current?.reset()
  }

  return (
    <SettingsContainer>
      <SettingsSubContainer>
        <p className="text-center text-xl">
          Change your password
        </p>
        <form action="" onSubmit={handleSubmit} ref={form}>
          <div>
            <Label htmlFor="username">
                Username
            </Label>
            <Input
            name="username"
            id="username"
            type="text"
            placeholder="Username"
            />
          </div>
          <div>
            <Label htmlFor="password">
              Current password
            </Label>
            <Input
              name="password"
              id="password"
              type="password"
              placeholder=" Your current password"
            />
          </div>
          <div>
            <Label htmlFor="newpassword">
              New password
            </Label>
            <Input
              name="newpassword"
              id="newpassword"
              type="password"
              placeholder="New password"
            />
          </div>
          <div>
            <Label htmlFor="confirmnewpassword">
              Confirm new password
            </Label>
            <Input
              name="confirmnewpassword"
              id="confirmnewpassword"
              type="password"
              placeholder="Confirm new password"
            />
          </div>
          <div className="mt-2">
          <ButtonDisabled
              disabled={disabled}
          >Submit</ButtonDisabled>
          </div>
        </form>
      </SettingsSubContainer>

    </SettingsContainer>
  );
};

export default Settings;