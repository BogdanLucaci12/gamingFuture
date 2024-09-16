import styled from "styled-components";

export const LightButton=styled.div`
border-radius:1em;
cursor:pointer;
padding:.4em;
&:hover{
background-color:white;
color:black;
}
`
type PaddingValue={
    padding:string
}

export const DarkButton=styled(LightButton)<PaddingValue>`
color:black;
border:1px solid black;
padding: ${({padding})=> padding || '.4em' };
&:hover{
background-color:black;
color:white;
}
`

