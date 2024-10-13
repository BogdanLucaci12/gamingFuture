import styled from "styled-components";

export const ChangePCQIContainer =styled.div`
border:1px solid rgba(0,0,0,.2);
border-radius:1em;
display:flex;
flex-direction:column;
min-height:40em;
box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.2);
padding:.5em;
width:100%;

`

type DetailContainerProps = {
    clicked: boolean;
};

export const DetailContainer=styled.div<DetailContainerProps>`
color:${({ clicked }) => (clicked ? 'black' : 'white')};
background-color:${({ clicked }) => (clicked ? 'white' : 'black')};
display:flex;
flex-direction:column;
border-radius:1em;
width:12em;
height:7em;
align-items:center;
border: 4px solid rgba(0,0,0, .2);
 flex-shrink:0;
&:hover{
background-color:white;
cursor:pointer;
color:black;
}

@media(max-width:735px){
width:11em;
font-size:.7em;
}
`
export const ChangePCQIScrollContainer=styled.div`
height:8em;
display:flex;
overflow-x:auto;
gap:1em;
border-bottom: 3px solid rgba(0,0,0, .4);
padding:.4em;
width:100%;

@media(max-width:735px){
height:6em
}
`