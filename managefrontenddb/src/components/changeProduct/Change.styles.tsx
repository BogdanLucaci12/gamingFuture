import styled from "styled-components";

export const ChangeDetailPCQIContainer =styled.div`
width:100%;
display:flex;
flex-direction:column;
padding:.5em;
@media(max-width:735px){
  margin-bottom:5em;
}
`

export const ChangeDetailSubmitPCQContainer=styled.div`
display:flex;
flex-direction:column;
align-items:center;
gap:1em;

@media(max-width:732px){
width:100%;
font-size:.7em;
}
`

export const ChangeImageContainer=styled.div`
height:100%;
width:100%;
margin-top:2em;
display:flex;
flex-direction:column;
box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.2);
padding:1em;
position:relative;
overflow:hidden;
`

export const ImageContainer=styled.div`
overflow-x: auto;
display:flex;
gap:.6em;
justify-content:flex-start;
flex-directtion:row;
align-items:center;
height:20em;
white-space: nowrap;
width:100%;

 img {
    flex-shrink:0;
    height:15.5em;
    max-width:none;
  }
`

export const ChangePCQ=styled.div`
display:flex;
justify-content:space-evenly;
width:100%;
gap:1em;

@media(max-width:732px){
flex-direction:column
}
`

export const ChandeDescriptionContainer=styled.div`
box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.2);
padding:.5em;
border-radius:1em
`