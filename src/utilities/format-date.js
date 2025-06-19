export function formatDate(timestamp, dateformatString) {
    const date = new Date(timestamp);

    const monthsLong = ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'];
    const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const daysLong = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
    const daysShort = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];

    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const dayOfWeek = date.getDay();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    const format = {
        'YYYY': year,
        'YY': year.toString().slice(-2),
        'MMMM': monthsLong[month],
        'MMM': monthsShort[month],
        'MM': String(month + 1).padStart(2, '0'),
        'M': month + 1,
        'DD': String(day).padStart(2, '0'),
        'D': day,
        'dddd': daysLong[dayOfWeek],
        'ddd': daysShort[dayOfWeek],
        'HH': String(hour).padStart(2, '0'),
        'H': hour,
        'mm': String(minute).padStart(2, '0'),
        'm': minute,
        'ss': String(second).padStart(2, '0'),
        's': second,
    };

    const dateFormatArray = dateformatString.match(/[ymdhs]+|[^ymdhs]+/gi);

    return dateFormatArray.map(part => format[part] ?? part).join('');

}