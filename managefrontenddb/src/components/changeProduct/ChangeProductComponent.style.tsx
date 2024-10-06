import styled from "styled-components";

export const ChangeBrandCategoryContainer=styled.div`
display:flex;
flex-direction:row;
gap:1.25rem;
align-items:center;

@media(max-width:732px){
flex-direction:column;
margin-top:1em
}
`

export const ChangeTitleContainer=styled.form`
width:full;
display:flex;
flex-direction:column;
gap:1rem
`