import styled from "styled-components";

export const HomeContainer=styled.div`
width:100%;
height:auto;
display:flex;
flex-direction:column;
padding:1em;
gap:1em
`

export const ShowProduct=styled.div`
width:full;
display:flex;
gap:1em;
flex-wrap:wrap;
height:full;

@media(max-width:735px){ 
justify-content:center;
margin-bottom:5em
}
`