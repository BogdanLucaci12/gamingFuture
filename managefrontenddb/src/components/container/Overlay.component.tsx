import { ReactNode } from "react";
import { FloatPanelContainer, MainBody } from "../floatContainer/FloatContainer.styles";
type OverlayProps={
  children:ReactNode
}

const Overlay = ({children}:OverlayProps) => {


  return (
      <MainBody >
      <FloatPanelContainer>
        {children}
      </FloatPanelContainer>
    </MainBody>
  );
};

export default Overlay;