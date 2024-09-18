import styled from 'styled-components'

export const NavBarContainer=styled.div`
    height:3.5em;
    width:100%;
    background-color:black;
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    align-items:center;
    color:white;
    padding:0 .5em;

    div{
    margin:.2em;
    }

    img{
    height:3em;
    border-radius:1em;
    }

`

export const ControlPanel=styled.div`
display:flex;
flex-direction:row;
gap:.5em;
justify-content:center;
align-items:center;

@media(max-width:735px){
position:absolute;
z-index:1;
border:1px solid black;
border-radius:1em;
background-color:black;
flex-direction:column;
width:10em;
align-items:flex-start;
left:-4em;

 &::before {
    content: '';
    position: absolute;
    top: -3em;
    left: 50%;
    transform: translateX(-50%);
    height:3.3em;
    width:10em;
    background-color:none;
    cursor:pointer
  }
}
`
export const AccountPanel=styled.div`
display:flex;
flex-direction: coulumn;
gap:.6em;
justify-content:center;
align-items:center
`

export const AccountDropdownManu=styled.div`
position:absolute;
background-color:rgba(0,0,0,.6);
height:auto;
top:3em;
border-radius:1em;

  &::before {
    content: '';
    position: absolute;
    top: -3em; 
    left: 50%;
    transform: translateX(-50%);
    height:4em;
    width:10em;
    background-color:none;
    cursor:pointer
  }
`
