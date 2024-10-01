export const hasTwoDecimalPlaces = (num: number | string): boolean => {
    // Transforma numărul într-un string și împarte-l la punctul zecimal (.)
   if(num===undefined) return false
    const decimalPart = num.toString().split('.')[1];

    return decimalPart !== undefined && decimalPart.length === 2;
};
