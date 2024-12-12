exports.getMonthName = (date) => {
    const dateObj = new Date(date);  // 2009-11-10
    const month = dateObj.toLocaleString('default', { month: 'numeric',  month: '2-digit' });
    return month;
}

exports.getDayName = (date) => {
    const dateObj = new Date(date);  // 2009-11-10
    const day = dateObj.toLocaleString('default', { day: 'numeric',  day: '2-digit' });
    return day;
}

exports.getYear = (date) => {
    const dateObj = new Date(date);  // 2009-11-10
    const day = dateObj.toLocaleString('default', { year: 'numeric' });
    return day;
}

exports.getHours = (date) => {
    const dateObj = new Date(date);  // 2009-11-10
    const day = dateObj.getHours();
    return String(day).padStart(2, "0");
}

exports.getMinutes = (date) => {
    const dateObj = new Date(date);  // 2009-11-10
    const day = dateObj.getMinutes();
    return String(day).padStart(2, "0");
}

exports.getTime = (date) => {
    const dateObj = new Date(date); 
    var time = dateObj.toLocaleTimeString('en-US');
    return time;
}

exports.calculateAge = (dob) => {
    var dob = new Date(dob);
    //calculate month difference from current date in time
    var month_diff = Date.now() - dob.getTime();
    
    //convert the calculated difference in date format
    var age_dt = new Date(month_diff); 
    
    //extract year from date    
    var year = age_dt.getUTCFullYear();
    
    //now calculate the age of the user
    var age = Math.abs(year - 1970);
    return age
}