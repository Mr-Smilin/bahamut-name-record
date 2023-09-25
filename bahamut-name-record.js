// ==UserScript==
// @name         巴友暱稱紀錄
// @namespace    https://smilin.net
// @version      0.8
// @description  對天尊特攻寶具
// @author       smilin
// @match        https://forum.gamer.com.tw/C.php*
// @match        https://forum.gamer.com.tw/Co.php*
// @grant        none
// @license MIT
// ==/UserScript==

(function () {
	if (typeof indexedDB === "undefined") return;
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
		button.className = "usertitle";
		button.setAttribute("isshow", "false");
		button.style.borderWidth = "0px";
		button.style.padding = "1px 6px";
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

	const replyDiv = (localStor, contentUser) => {
		const div = document.createElement("div");
		div.className = "name-list-reply-div";
		div.style.position = "relative";
		div.style.display = "inline";

		const names = nameList(localStor);
		setHoverShow(contentUser, names);

		div.appendChild(names);

		return div;
	};
	//#endregion

	//#region 一些 DOM 模組化的效果
	function setHoverShow(triggerElement, targetElement) {
		// 初始隱藏 target 元素
		targetElement.style.display = "none";

		// 當 trigger 元素被滑過時，顯示 target 元素
		triggerElement.addEventListener("mouseover", function () {
			targetElement.style.display = "block";
		});

		// 當滑鼠離開 trigger 元素時，隱藏 target 元素
		triggerElement.addEventListener("mouseout", function () {
			targetElement.style.display = "none";
		});
	}
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

	//#region dom 渲染
	async function render() {
		const postDom = document.querySelectorAll(".c-post__header__author");
		const replyDom = document.querySelectorAll(".reply-content");
		await renderPostHeader(postDom);
		await renderReplyContent(replyDom);
		listenerAllMoreReplyButton();
	}

	// 渲染發文者
	async function renderPostHeader(dom) {
		for (let d of dom) {
			const userid = d.querySelector(".userid").textContent;
			const username = d.querySelector(".username").textContent.trim();
			const localStor = await searchUsername(userid, username);
			d.appendChild(mainDiv(localStor[userid]));
		}
	}

	// 渲染回文者
	async function renderReplyContent(dom) {
		for (let d of dom) {
			const contentUser = d.querySelector(".reply-content__user");
			// const contentFooter = d.querySelector(".reply-content__footer");
			const match = contentUser.href.match(/home.gamer.com.tw\/([^\/]+)/);
			const userid = match ? match[1] : null;
			if (!userid) continue;
			const username = contentUser.textContent.trim();
			const localStor = await searchUsername(userid, username);
			contentUser.appendChild(replyDiv(localStor[userid], contentUser));
			d.style.overflow = "unset";
			d.setAttribute("data-modified", "true");
		}
	}
	//#endregion

	//#region 按鍵監聽 & DOM 渲染
	function listenerAllMoreReplyButton() {
		let timeoutID = null;
		const moreButtons = document.querySelectorAll(".more-reply");
		const hideButtons = document.querySelectorAll(".hide-reply");
		for (let button of moreButtons) {
			button.addEventListener("click", function () {
				clearTimeout(timeoutID);
				timeoutID = setTimeout(() => {
					// 獲取所有未被標記過的元素
					const dom = document.querySelectorAll(
						".reply-content:not([data-modified])"
					);
					renderReplyContent(dom);
				}, 3000);
			});
		}
		for (let button of hideButtons) {
			button.addEventListener("click", function () {
				clearTimeout(timeoutID);
				// 折疊後 data-modified 還在，功能卻要重設，太麻煩了
				// 太麻煩了，先清除 timeout 就好...
			});
		}
	}
	//#endregion

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
