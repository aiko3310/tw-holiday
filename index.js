const fetch = require("node-fetch");


/**
 * 獲取假日資料，可選擇指定年份
 * @param {number|null} year 西元年份，不指定則獲取所有年份
 * @returns {Promise<Array>} 假日資料陣列
 */
async function getHolidays(year = null) {
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
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`API 請求失敗: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.length === 0) {
        hasMoreData = false;
      } else {
        // 如果指定了年份，只保留該年份的資料
        const filteredData = year !== null
          ? data.filter(holiday => Number(holiday.year) === year)
          : data;
        
        allHolidays = [...allHolidays, ...filteredData];
        page++;
        
        // 指定年份的優化：如果發現後面的資料年份已經超過了，就提前結束
        if (year !== null && filteredData.length === 0 && 
            data.some(h => Number(h.year) > year)) {
          hasMoreData = false;
          earlyExit = true;
        }
      }
    }
 
    
    return allHolidays.map(h => ({
      ...h,
      month:h.date.substring(4, 6),
      date:h.date.substring(6, 8),
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
 * @returns {Promise<Array>} 排除週六日後的假日資料陣列
 */
async function getHolidaysExcludeWeekends(year = null) {
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

module.exports = {
  getHolidays,
  getHolidaysExcludeWeekends,
};
