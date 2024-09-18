import styled from "styled-components";

export const AdminDashboardContainer=styled.div`
width:100%;
height:auto;
display:flex;
flex-direction:row;
justify-content:space-evenly;

@media(max-width:735px){
flex-direction:column;
align-items:center;
justify-content:normal;
gap:1em
}
`

export const AdminDashboardSecondContainer=styled.div`
width:40%;

@media(max-width:735px){
width:90%
}
`