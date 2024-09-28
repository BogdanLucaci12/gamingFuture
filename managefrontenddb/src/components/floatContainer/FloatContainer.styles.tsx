import styled from "styled-components";

export const FloatPanelContainer=styled.div`
position:relative;
width:50%;
height:15em;
background-color:white;
border-radius:1em;
box-shadow: 0px 0px 26px -3px rgba(0,0,0,0.3);
display:grid;
justify-items: center;
align-content: space-around;

@media (max-width:735px){
width:90%
}
`

export const MainBody=styled.div`
position:absolute;
width:100%;
height:100%;
display:flex;
justify-content:center;
align-items:center;
background-color:rgba(0,0,0,.2);
z-index:10;
`