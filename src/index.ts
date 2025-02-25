import fetch from 'node-fetch';

// API 回應的假日資料介面
interface HolidayResponse {
  date: string;
  year: string;
  name: string | null;
  isholiday: string;
  holidaycategory: string|null;
  description: string|null;
}

// 處理後的假日資料介面
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
async function getHolidays(year: number | null = null): Promise<ProcessedHoliday[]> {
  if (year !== null && (typeof year !== 'number' || year < 2016)) {
    throw new Error('資料最早只有到 2016 年');
  }
  
  try {
    let allHolidays: HolidayResponse[] = [];
    let page = 0;
    let hasMoreData = true;
    let earlyExit = false;
    
    while (hasMoreData) {
      const apiUrl = `https://data.ntpc.gov.tw/api/datasets/308DCD75-6434-45BC-A95F-584DA4FED251/json?page=${page}&size=1000`;
      const response = await fetch(apiUrl,{});
      
      if (!response.ok) {
        throw new Error(`API 請求失敗: ${response.status} ${response.statusText}`);
      }
      
      const data: HolidayResponse[] = await response.json();
      
      if (data.length === 0) {
        hasMoreData = false;
      } else {
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
    
    return allHolidays.map(h => ({
      ...h,
      month: h.date.substring(4, 6),
      date: h.date.substring(6, 8),
      allDate: h.date
    }));
  } catch (error) {
    const errorMsg = year !== null 
      ? `獲取 ${year} 年假日資料時發生錯誤` 
      : `獲取假日資料時發生錯誤`;
    console.error(errorMsg, error);
    throw error;
  }
}

/**
 * 獲取假日資料，排除週六日，可選擇指定年份
 * @param {number|null} year 西元年份，不指定則獲取所有年份
 * @returns {Promise<ProcessedHoliday[]>} 排除週六日後的假日資料陣列
 */
async function getHolidaysExcludeWeekends(year: number | null = null): Promise<ProcessedHoliday[]> {
  try {
    const holidays = await getHolidays(year);
    
    return holidays.filter(holiday => 
      holiday.holidaycategory !== "星期六、星期日" &&
      holiday.isholiday === "是"
    );
  } catch (error) {
    const errorMsg = year !== null 
      ? `獲取 ${year} 年非週末假日資料時發生錯誤` 
      : `獲取非週末假日資料時發生錯誤`;
    console.error(errorMsg, error);
    throw error;
  }
}

export {
  getHolidays,
  getHolidaysExcludeWeekends,
  HolidayResponse,
  ProcessedHoliday
}; 