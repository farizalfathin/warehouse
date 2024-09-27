export const formatCurrency = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(price);
}

export const formatTextSlice = (
    text: string,
    maxLength: number,
    style: string = "..."
) => {
    const textSlice = text.slice(0, maxLength);
    return text.length >= maxLength ? textSlice + style : text
}