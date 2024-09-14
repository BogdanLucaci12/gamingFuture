function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function checkCorrectPrice(price){
    const formattedPrice = parseFloat(price);
    if (!price.toString().includes(".")) {
        // Check . in the number, add ".00"
        return formattedPrice.toFixed(2);
    }
   //Check if price id NaN
    if (isNaN(formattedPrice)) {
       return {error:"Price must be a number"}
    }
    
    const decimalPart = price.split('.')[1];
    
    if (decimalPart === undefined) {
        return formattedPrice.toFixed(2)
    }
    if (decimalPart === "") {
        return { error: "Price is not in the correct format" }
    }
    if (decimalPart.length === 1) {
       //if it is 1 digits then add a 0
        return {error:"Price has 1 digit"}
    } 
     if (decimalPart.length > 2) {
        //check if price has more than two digits
        return {error:"Price has more than two digit"}
    }
   
    //Check if price has two digits

    return price 
    }

module.exports = { capitalizeFirstLetter, checkCorrectPrice }