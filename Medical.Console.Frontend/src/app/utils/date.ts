export const getHexadecimalDate = (): string => {
    const timestamp = Date.now();
    const uniqueHex = timestamp.toString(16);
    return uniqueHex;
};

export const transformDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    return `${month.toString().padStart(2, '0')}/${day
        .toString()
        .padStart(2, '0')}/${year}`;
};
