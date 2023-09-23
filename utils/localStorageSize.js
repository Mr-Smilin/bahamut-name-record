// 計算 localStorage 使用量

let size = 0;
for (item in localStorage) {
	if (localStorage.hasOwnProperty(item)) {
		size += localStorage.getItem(item).length;
	}
}
console.log("---");
console.log(size / 1024);
