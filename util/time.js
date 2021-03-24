function format(value, format) {
    if (format === undefined || format === 'HH:mm:ss') {
        if (undefined === value || null === value || value.length === 0) {
            return '00:00:00';
        }
        value = parseFloat(value);
        if (typeof (value) !== 'number') {
            return value;
        }
        const hour = Math.floor(value / 60 / 60);
        const minute = Math.floor((value - hour * 60 * 60) / 60);
        const second = Math.round(value % 60);
        return (hour > 9 ? hour : '0' + hour) + ':' + (minute > 9 ? minute : '0' + minute) + ':' + (second > 9 ? second : '0' + second);
    }

    if (format === undefined || format === 'mm:ss') {
        if (undefined === value || null === value || value.length === 0) {
            return '00:00';
        }
        value = parseFloat(value);
        if (typeof (value) !== 'number') {
            return value;
        }
        const hour = Math.floor(value / 60 / 60);
        const minute = Math.floor((value - hour * 60 * 60) / 60);
        const second = Math.round(value % 60);

        if (hour === 0) {
            return (minute > 9 ? minute : '0' + minute) + ':' + (second > 9 ? second : '0' + second);
        }
        return (hour > 9 ? hour : '0' + hour) + ':' + (minute > 9 ? minute : '0' + minute) + ':' + (second > 9 ? second : '0' + second);
    }
}


export default {
    format:format
};