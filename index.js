const fetch = require("node-fetch");
const apiUrl = page =>
  `https://data.ntpc.gov.tw/api/datasets/308DCD75-6434-45BC-A95F-584DA4FED251/json?page=${page}&size=1000`;

const holiday = [];

const init = new Promise(resolve => {
  let fetchPage = 0;
  const getHoliday = () => {
    fetch(apiUrl(fetchPage))
      .then(res => res.json())
      .then(response => {
        if (response.length) {
          holiday.push(...response);
          fetchPage++;
          return getHoliday();
        } else {
          resolve(holiday);
        }
      });
  };
  getHoliday();
});

const getAll = new Promise(resolve => {
  const result = {};
  if (holiday.length) {
    holiday.forEach(item => {
      result[item.date] = item;
    });
    resolve(result);
  } else {
    init.then(() => {
      holiday.forEach(item => {
        result[item.date] = item;
      });
      resolve(result);
    });
  }
});
const getWithOutDefaultHolidays = new Promise(resolve => {
  const result = {};
  if (holiday.length) {
    holiday.forEach(item => {
      if (
        item.holidayCategory !== "星期六、星期日" &&
        item.isHoliday === "是" &&
        item.name &&
        item.description
      ) {
        result[item.date] = item;
      }
    });
    resolve(result);
  } else {
    init.then(() => {
      holiday.forEach(item => {
        if (
          item.holidayCategory !== "星期六、星期日" &&
          item.isHoliday === "是" &&
          item.name &&
          item.description
        ) {
          result[item.date] = item;
        }
      });
      resolve(result);
    });
  }
});
module.exports = {
  getAll,
  getWithOutDefaultHolidays,
};
