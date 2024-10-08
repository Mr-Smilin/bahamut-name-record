# 巴友暱稱紀錄

作用範圍： C 頁、內文頁面  
發布日期： 2023/09/23  
最後修改日期： 2023/09/25  
作者： smilin （微笑）

# [演示網址](https://home.gamer.com.tw/artwork.php?sn=5800119)

[油猴](https://greasyfork.org/zh-TW/scripts/475916-%E5%B7%B4%E5%8F%8B%E6%9A%B1%E7%A8%B1%E7%B4%80%E9%8C%84)  
[Github](https://github.com/Mr-Smilin/bahamut-name-record)

當前版本： 0.10  
更新說明： 修正資料更新問題

<details> <summary>版本紀錄</summary>  
  <br>  
  
- 0.1： 初版上傳  
- 0.2： 調整代碼，jquery 全面替換成純 javascript，html結構生成代碼調整  
- 0.3： 調整 localStorage 存放規則  
- 0.4： 嘗試改用 localforage 存放資料
- 0.5： 嘗試改用 indexedDB 存放資料
- 0.6： 取消序列化存放  
- 0.7： 留言納入紀錄條件、按鈕&部份 css 調整  
- 0.8： 調整開頭邏輯，如不支援 DB 則不啟用此插件   
- 0.9： 改名觸發高亮提醒   
- 0.10： 修正資料更新問題   
  
</details>
  
<br>

目前實現

- [x] 發文者名稱紀錄、歷史查詢(如果有存)
- [x] localStorage 棄用，改成 indexedDB
- [x] 巴友留言納入記錄條件
- [x] 改名觸發高亮提醒

<br>

預計開發

- [ ] 查詢功能
- [ ] 備註替換暱稱功能

<br>

作者的其他腳本

[巴友 IP 紀錄](https://greasyfork.org/zh-TW/scripts/483109-%E5%B7%B4%E5%8F%8Bip%E7%B4%80%E9%8C%84)  
[巴哈圖片預覽](https://greasyfork.org/zh-TW/scripts/504221-%E5%B7%B4%E5%93%88%E5%9C%96%E7%89%87%E9%A0%90%E8%A6%BD)
