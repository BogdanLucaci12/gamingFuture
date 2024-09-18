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

export const OutlineButton=styled.div`
border:1px solid white;
padding:.3em;
color:white;
cursor:pointer;
width:auto;
border-radius:2em;

&:hover{
background-color:black;
border:1px solid black;
}
`

