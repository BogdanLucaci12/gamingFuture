import styled from "styled-components";

export const FlexibleContainer = styled.div`
    border:1px solid rgba(0,0,0,0.1);
    border-radius:1em;
    height:auto;
    box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.2);
    width:auto;
    padding:.5em
`

export const LoginFormContainer = styled(FlexibleContainer)`
    width:40%;
    align-self:center;
    justify-self: center;
    position:absolute;
    top: 50%; 
    left: 50%;
    transform: translate(-50%, -50%);
    
   @media(max-width:735px){
   width:100%
   }
`