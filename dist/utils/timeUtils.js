export const getStartOfToday = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
};
/**
 * Get end of today (23:59:59.999 WIB)
 */
export const getEndOfToday = () => {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    return now;
};
/**
 * Get start and end of today
 */
export const getTodayRange = () => {
    return {
        start: getStartOfToday(),
        end: getEndOfToday()
    };
};
/**
 * Get start of specific date
 */
export const getStartOfDate = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
};
/**
 * Check jika dua date adalah hari yang sama
 */
export const isSameDay = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
};
/**
 * Format tanggal untuk display
 */
export const formatDateID = (date) => {
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};
