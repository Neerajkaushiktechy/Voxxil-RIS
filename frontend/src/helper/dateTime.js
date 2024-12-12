
const getMonthName = (date) => {
    const dateObj = new Date(date);  // 2009-11-10
    const month = dateObj.toLocaleString('default', { month: 'short' });
    return month;
}

const getDayName = (date) => {
    const dateObj = new Date(date);  // 2009-11-10
    const day = dateObj.toLocaleString('default', { day: 'numeric' });
    return day;
}

const getYear = (date) => {
    const dateObj = new Date(date);  // 2009-11-10
    const day = dateObj.toLocaleString('default', { year: 'numeric' });
    return day;
}

const getTime = (date) => {
    const dateObj = new Date(date); 
    var time = dateObj.toLocaleTimeString('en-US');
    return time;
}



const generateFullDate = (date) => {
    const day = getDayName(date);
    const month = getMonthName(date);
    const year = getYear(date);
    return `${day}-${month}-${year}`
}



export {
    getMonthName,
    getDayName,
    generateFullDate,
    getTime
}