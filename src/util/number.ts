export function formatNumber(number: number) {
    return Math.floor(number).toLocaleString(undefined, {
        maximumFractionDigits: 0,
    });
}
