"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHolidays = getHolidays;
exports.getHolidaysExcludeWeekends = getHolidaysExcludeWeekends;
const node_fetch_1 = __importDefault(require("node-fetch"));
/**
 * 獲取假日資料，可選擇指定年份
 * @param {number|null} year 西元年份，不指定則獲取所有年份
 * @returns {Promise<ProcessedHoliday[]>} 假日資料陣列
 */
function getHolidays() {
    return __awaiter(this, arguments, void 0, function* (year = null) {
        if (year !== null && (typeof year !== 'number' || year < 2016)) {
            throw new Error('資料最早只有到 2016 年');
        }
        try {
            let allHolidays = [];
            let page = 0;
            let hasMoreData = true;
            let earlyExit = false;
            while (hasMoreData) {
                const apiUrl = `https://data.ntpc.gov.tw/api/datasets/308DCD75-6434-45BC-A95F-584DA4FED251/json?page=${page}&size=1000`;
                const response = yield (0, node_fetch_1.default)(apiUrl, {});
                if (!response.ok) {
                    throw new Error(`API 請求失敗: ${response.status} ${response.statusText}`);
                }
                const data = yield response.json();
                if (data.length === 0) {
                    hasMoreData = false;
                }
                else {
                    const filteredData = year !== null
                        ? data.filter(holiday => Number(holiday.year) === year)
                        : data;
                    allHolidays = [...allHolidays, ...filteredData];
                    page++;
                    if (year !== null && filteredData.length === 0 &&
                        data.some(h => Number(h.year) > year)) {
                        hasMoreData = false;
                        earlyExit = true;
                    }
                }
            }
            return allHolidays.map(h => (Object.assign(Object.assign({}, h), { month: h.date.substring(4, 6), date: h.date.substring(6, 8), allDate: h.date })));
        }
        catch (error) {
            const errorMsg = year !== null
                ? `獲取 ${year} 年假日資料時發生錯誤`
                : `獲取假日資料時發生錯誤`;
            console.error(errorMsg, error);
            throw error;
        }
    });
}
/**
 * 獲取假日資料，排除週六日，可選擇指定年份
 * @param {number|null} year 西元年份，不指定則獲取所有年份
 * @returns {Promise<ProcessedHoliday[]>} 排除週六日後的假日資料陣列
 */
function getHolidaysExcludeWeekends() {
    return __awaiter(this, arguments, void 0, function* (year = null) {
        try {
            const holidays = yield getHolidays(year);
            return holidays.filter(holiday => holiday.holidaycategory !== "星期六、星期日" &&
                holiday.isholiday === "是");
        }
        catch (error) {
            const errorMsg = year !== null
                ? `獲取 ${year} 年非週末假日資料時發生錯誤`
                : `獲取非週末假日資料時發生錯誤`;
            console.error(errorMsg, error);
            throw error;
        }
    });
}
