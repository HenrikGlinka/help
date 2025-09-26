export default function capitalizeFirstLetters(string) {
    if (typeof string !== 'string') return '';
    return string.replace(/\b\w/g, char => char.toUpperCase());
}