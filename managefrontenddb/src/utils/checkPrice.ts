export const hasTwoDecimalPlaces = (num: number | string): boolean => {
    // Transforma numărul într-un string și împarte-l la punctul zecimal (.)
    const decimalPart = num.toString().split('.')[1];

    // Verifică dacă există partea zecimală și dacă are exact 2 caractere
    return decimalPart !== undefined && decimalPart.length === 2;
};
