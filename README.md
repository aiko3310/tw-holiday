# tw-holiday

檢查台灣國定假日
[使用政府開源 api](https://data.ntpc.gov.tw/openapi/swagger-ui/index.html?configUrl=%2Fopenapi%2Fswagger%2Fconfig&urls.primaryName=%E6%96%B0%E5%8C%97%E5%B8%82%E6%94%BF%E5%BA%9C%E4%BA%BA%E4%BA%8B%E8%99%95(20)#/)

## 使用方式

### getAll

會回傳所有有放假日期的 Promise
`
getAll.then(res => res)
`

### getWithOutDefaultHolidays

會排除週六日的特殊放假
`
getWithOutDefaultHolidays.then(res => res)
`
