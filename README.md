# tw-holiday

檢查台灣國定假日
[使用政府開源 api](https://data.ntpc.gov.tw/datasets/308dcd75-6434-45bc-a95f-584da4fed251)

## 使用方式

### getHolidays

會回傳所有有放假日期的 Promise  

`
await getHolidays()
`  

可傳入西元年份，最早資料至 2016年

`
await getHolidays(2025)
`

### getHolidaysExcludeWeekends

會排除週六日的特殊放假  

`
await getHolidaysExcludeWeekends()
`

可傳入西元年份，最早資料至 2016年

`
await getHolidaysExcludeWeekends(2025)
`

| 版本 | 日期 | 更新內容 |
|------|------|----------|
| 2.0.0 | 2024-02-24 | - 轉換為 TypeScript<br>- 新增型別定義<br>- 支援 TypeScript 專案使用 |
| 1.1.0 | 2024-02-24 | 更新 api 串接 |

