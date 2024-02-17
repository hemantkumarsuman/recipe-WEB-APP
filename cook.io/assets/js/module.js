
"use strict";

export const getTime = (minute) => {
    const hour = Math.floor(minute/60); //Number

    const day= Math.floor(hour / 24); //Number
    const time = day || hour || minute; //Number
    const unitIndex = [day, hour, minute].lastIndexOf(time); //Number

    const timeUnit = ['days', 'hours', 'minutes'][unitIndex]; //string

    return {time, timeUnit};
}