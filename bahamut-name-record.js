if (typeof Storage === "undefined") return;
if ($(".c-post__header__author").get(0) === undefined) return;

// <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-wEmeIV1mKuiNpC+IOBjI7aAzPcEZeedi5yW5f2yOq55WWLwNGmvvx4Um1vskeMj0" crossorigin="anonymous">
/*
usernames = {
    userid: {
        lastUpdated: new Date().toISOString().split('T')[0],
		isRead: true,
        data: [
        {
            name: "John",
            day: "2020-01-01", new Date().toISOString().split('T')[0]
        }
    ]}
}
*/

const clickButton = `<button type="button" class="floor tippy-gpbp" isshow=false onclick="showMessage(this)">歷史紀錄</button>`;

const nameList = (localStor) => {
	let listString = ``;
	localStor.data.forEach((element) => {
		listString += `<tr><td>${element.name}</td><td>${element.day}</td></tr>`;
	});
	return `<table class="name-list themepage-entrance__preview" style="display: none; white-space:nowrap;" width="98%" border="1" cellspacing="1" cellpadding="1"><tbody>
    <tr>
        <td>名字</td>
        <td>發現時間(本地)</td>
    </tr>
    ${listString}
    </tbody></table>`;
};

const mainDiv = (localStor) => {
	const names = nameList(localStor);
	return $(
		`<div class="name-list-main-div" style="position:relative;display:inline;">${clickButton}${names}</div>`
	);
};

function initLocalStor(userid, username) {
	const localStor = {
		lastUpdated: null,
		isRead: true,
		data: [
			{
				name: username,
				day: new Date().toISOString().split("T")[0],
			},
		],
	};
	localStorage.setItem(userid, JSON.stringify(localStor));
	return localStor;
}

function addUsername(userid, username, localStor) {
	localStor.lastUpdated = new Date().toISOString().split("T")[0];
	localStor.data.push({
		name: username,
		day: new Date().toISOString().split("T")[0],
	});
	localStorage.setItem(userid, JSON.stringify(localStor));
	return localStor;
}

function checkLocalStor(userid, username, localStor) {
	let isUse = false;
	localStor.data.forEach((element) => {
		if (element.name === username) isUse = true;
	});
	if (!isUse) {
		localStor = addUsername(userid, username, localStor);
	}
	return localStor;
}

function searchUsername(userid, username) {
	let localStor = JSON.parse(localStorage.getItem(userid));
	if (localStor === null) {
		localStor = initLocalStor(userid, username);
	} else {
		localStor = checkLocalStor(userid, username, localStor);
	}
	return localStor;
}

// 畫面渲染
function render() {
	const dom = $(".c-post__header__author");
	for (d of dom) {
		const userid = $(d).find(".userid").text();
		const username = $(d)
			.find(".username")
			.text()
			.replace(/(^[\s]*)|([\s]*$)/g, "");
		const localStor = searchUsername(userid, username);
		$(d).append(mainDiv(localStor));
	}
}

// js
const showMessage = function showMessage(element) {
	if ($(element).attr("isshow") === "true") {
		$(element).next(".name-list").css("display", "none");
		$(element).attr("isshow", "false");
	} else {
		$(element).next(".name-list").css("display", "flex");
		$(element).attr("isshow", "true");
	}
};

$("body").append(
	$(`<script>
        ${showMessage}
    </script>`)
);
render();
