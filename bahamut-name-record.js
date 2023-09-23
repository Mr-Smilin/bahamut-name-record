// ==UserScript==
// @name         巴友暱稱紀錄
// @namespace    https://forum.gamer.com.tw
// @version      0.6
// @description  發文者暱稱紀錄
// @author       You
// @match        https://forum.gamer.com.tw/C.php*
// @match        https://forum.gamer.com.tw/Co.php*
// @grant        none
// @license MIT
// ==/UserScript==

(function () {
	if (typeof Storage === "undefined") return;
	if (!document.querySelector(".c-post__header__author")) return;

	//#region indexedDB
	const dbName = "nameRecordDB";
	const storeName = "nameRecordStore";
	const dbVersion = 1;

	function openDB() {
		return new Promise((resolve, reject) => {
			const openRequest = indexedDB.open(dbName, dbVersion);
			openRequest.onerror = function (event) {
				reject("Error opening DB");
			};
			openRequest.onsuccess = function (event) {
				resolve(event.target.result);
			};
			openRequest.onupgradeneeded = function (event) {
				const db = event.target.result;
				if (!db.objectStoreNames.contains(storeName)) {
					db.createObjectStore(storeName, { keyPath: "id" });
				}
			};
		});
	}

	async function setItem(key, value) {
		const db = await openDB();
		const transaction = db.transaction(storeName, "readwrite");
		const store = transaction.objectStore(storeName);
		return new Promise((resolve, reject) => {
			const request = store.put({ id: key, value: value });
			request.onsuccess = function () {
				resolve();
			};
			request.onerror = function (event) {
				reject("Error storing data");
			};
		});
	}

	async function getItem(key) {
		const db = await openDB();
		const transaction = db.transaction(storeName, "readonly");
		const store = transaction.objectStore(storeName);
		return new Promise((resolve, reject) => {
			const request = store.get(key);
			request.onsuccess = function (event) {
				resolve(event.target.result ? event.target.result.value : null);
			};
			request.onerror = function (event) {
				reject("Error fetching data");
			};
		});
	}
	//#endregion

	const localStorageName = "record-name";

	//#region DOM 生成
	function nameList(localStor) {
		// 創建 table 元素
		const table = document.createElement("table");
		table.className = "name-list themepage-entrance__preview";
		table.style.whiteSpace = "nowrap";
		table.style.display = "none";

		// 創建 tbody 元素
		const tbody = document.createElement("tbody");
		table.appendChild(tbody);

		// 創建標題行
		const headerRow = document.createElement("tr");
		const headerNameCell = createTableCell("名字");
		const headerDayCell = createTableCell("發現時間(本地)");
		headerRow.appendChild(headerNameCell);
		headerRow.appendChild(headerDayCell);
		tbody.appendChild(headerRow);

		// 根據 localStor.data 創建表格的每一行
		localStor.data.forEach((element) => {
			const row = document.createElement("tr");
			const nameCell = createTableCell(element.name);
			const dayCell = createTableCell(element.day);
			row.appendChild(nameCell);
			row.appendChild(dayCell);
			tbody.appendChild(row);
		});

		return table;
	}

	function createTableCell(text) {
		const td = document.createElement("td");
		td.textContent = text;

		// 設置 td 的 padding
		td.style.padding = "8px";

		return td;
	}

	function clickButton() {
		const button = document.createElement("button");
		button.type = "button";
		button.className = "floor tippy-gpbp";
		button.setAttribute("isshow", "false");
		button.onclick = function () {
			showMessage(this);
		};
		button.textContent = "歷史紀錄";
		return button;
	}

	const mainDiv = (localStor) => {
		const names = nameList(localStor);
		const div = document.createElement("div");
		div.className = "name-list-main-div";
		div.style.position = "relative";
		div.style.display = "inline";

		div.appendChild(clickButton());
		div.appendChild(names);

		return div;
	};
	//#endregion

	//#region 資料管理 api
	function initUser(userid, username, localStor) {
		localStor = {
			...localStor,
			[userid]: {
				lastUpdated: null,
				isRead: true,
				noteName: "",
				data: [
					{
						name: username,
						day: new Date().toISOString().split("T")[0],
					},
				],
			},
		};
		setItem(localStorageName, localStor);
		return localStor;
	}

	function addUsername(userid, username, localStor) {
		localStor[userid].lastUpdated = new Date().toISOString().split("T")[0];
		localStor[userid].data.push({
			name: username,
			day: new Date().toISOString().split("T")[0],
		});
		setItem(localStorageName, localStor);
		return localStor;
	}

	function checkLocalStor(userid, username, localStor) {
		let isUse = false;
		localStor[userid].data.forEach((element) => {
			if (element.name === username) isUse = true;
		});
		if (!isUse) {
			localStor = addUsername(userid, username, localStor);
		}
		return localStor;
	}

	async function searchUsername(userid, username) {
		let localStor = await getItem(localStorageName);
		if (!localStor || localStor[userid] === undefined) {
			localStor = initUser(userid, username, localStor);
		} else {
			localStor = checkLocalStor(userid, username, localStor);
		}
		return localStor;
	}
	//#endregion

	// dom 渲染
	async function render() {
		const dom = document.querySelectorAll(".c-post__header__author");
		for (let d of dom) {
			const userid = d.querySelector(".userid").textContent;
			const username = d.querySelector(".username").textContent.trim();
			const localStor = await searchUsername(userid, username);
			d.appendChild(mainDiv(localStor[userid]));
		}
	}

	// 歷史紀錄 click
	const showMessage = function showMessage(element) {
		const nextElement = element.nextElementSibling;
		if (element.getAttribute("isshow") === "true") {
			nextElement.style.display = "none";
			element.setAttribute("isshow", "false");
		} else {
			nextElement.style.display = "flex";
			element.setAttribute("isshow", "true");
		}
	};

	render();
})();
