import {type ReactNode } from "react";
import { Button } from "../ui/button";
import { IoGameControllerOutline } from "react-icons/io5";

type ButtonDisabledType={
children:ReactNode,
disabled:boolean,
className:string | ''
}

const ButtonDisabled = ({ children, disabled, className }: ButtonDisabledType) => {

  return (
      <Button
          disabled={disabled}
       className={className}
          >
          {
              disabled &&
              <IoGameControllerOutline className="mr-2 h-6 w-6 animate-spin" />
          }
          {children}</Button>
  );
};

export default ButtonDisabled;