// ==UserScript==
// @name         巴友暱稱紀錄
// @namespace    https://forum.gamer.com.tw
// @version      0.3
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

	const localStorageName = "record-name";

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
		localStorage.setItem(localStorageName, JSON.stringify(localStor));
		return localStor;
	}

	function addUsername(userid, username, localStor) {
		localStor[userid].lastUpdated = new Date().toISOString().split("T")[0];
		localStor[userid].data.push({
			name: username,
			day: new Date().toISOString().split("T")[0],
		});
		localStorage.setItem(localStorageName, JSON.stringify(localStor));
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

	function searchUsername(userid, username) {
		let localStor = JSON.parse(localStorage.getItem(localStorageName));
		if (localStor[userid] === undefined) {
			localStor = initUser(userid, username, localStor);
		} else {
			localStor = checkLocalStor(userid, username, localStor);
		}
		return localStor;
	}

	// dom 渲染
	function render() {
		const dom = document.querySelectorAll(".c-post__header__author");
		dom.forEach((d) => {
			const userid = d.querySelector(".userid").textContent;
			const username = d.querySelector(".username").textContent.trim();
			const localStor = searchUsername(userid, username);
			d.appendChild(mainDiv(localStor[userid]));
		});
	}

	// 歷史紀錄 click
	const showMessage = function (element) {
		const nextElement = element.nextElementSibling;
		if (element.getAttribute("isshow") === "true") {
			nextElement.style.display = "none";
			element.setAttribute("isshow", "false");
		} else {
			nextElement.style.display = "flex";
			element.setAttribute("isshow", "true");
		}
	};

	const scriptTag = document.createElement("script");
	scriptTag.innerHTML = `${showMessage}`;
	document.body.appendChild(scriptTag);

	render();
})();
