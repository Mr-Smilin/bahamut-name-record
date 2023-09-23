# 巴友暱稱紀錄

作用範圍： C 頁、內文頁面  
發布日期： 2023/09/23  
最後修改日期： 2023/09/23  
作者： smilin （微笑）

[油猴](https://greasyfork.org/zh-TW/scripts/475916-%E5%B7%B4%E5%8F%8B%E6%9A%B1%E7%A8%B1%E7%B4%80%E9%8C%84)  
[Github](https://github.com/Mr-Smilin/bahamut-name-record)

當前版本： 0.7

<details> <summary>版本紀錄</summary>  
  <br>  
  
- 0.1： 初版上傳  
- 0.2： 調整代碼，jquery 全面替換成純 javascript，html結構生成代碼調整  
- 0.3： 調整 localStorage 存放規則  
- 0.4： 嘗試改用 localforage 存放資料
- 0.5： 嘗試改用 indexedDB 存放資料
- 0.6： 取消序列化存放
- 0.7： 留言納入紀錄條件
  
</details>
  
<br>

目前實現

- [x] 發文者名稱紀錄、歷史查詢(如果有存)
- [x] localStorage 棄用，改成 indexedDB
- [x] 巴友留言納入記錄條件

<br>

預計開發

- [ ] 改名觸發高亮提醒
- [ ] 查詢功能
- [ ] 備註替換暱稱功能
