interface HolidayResponse {
    date: string;
    year: string;
    name: string | null;
    isholiday: string;
    holidaycategory: string | null;
    description: string | null;
}
interface ProcessedHoliday extends HolidayResponse {
    month: string;
    date: string;
    allDate: string;
}
/**
 * 獲取假日資料，可選擇指定年份
 * @param {number|null} year 西元年份，不指定則獲取所有年份
 * @returns {Promise<ProcessedHoliday[]>} 假日資料陣列
 */
declare function getHolidays(year?: number | null): Promise<ProcessedHoliday[]>;
/**
 * 獲取假日資料，排除週六日，可選擇指定年份
 * @param {number|null} year 西元年份，不指定則獲取所有年份
 * @returns {Promise<ProcessedHoliday[]>} 排除週六日後的假日資料陣列
 */
declare function getHolidaysExcludeWeekends(year?: number | null): Promise<ProcessedHoliday[]>;
export { getHolidays, getHolidaysExcludeWeekends, HolidayResponse, ProcessedHoliday };
