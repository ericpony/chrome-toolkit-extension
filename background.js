chrome.contextMenus.removeAll();
chrome.contextMenus.create({
	id    : 'search',
	title : "透過 IQDB 搜尋這張圖片 (&1)",
	type  : "normal",
	contexts : ['link','image'],
	onclick: function (info, tab) {
		var img_link 	=info.srcUrl || info.linkUrl || info.pageUrl;
		if(!img_link) return;
		chrome.tabs.create({ url: 'http://iqdb.org/?url=' + encodeURIComponent(img_link)});
	}
});
chrome.contextMenus.create({
	id    : 'parse',
	title : "重新分析頁面 (&2)",
	type  : "normal",
	contexts : ['all'],
	onclick: function (info, tab) {
		chrome.tabs.executeScript(null, {file: 'lib/jquery-1.11.2.min.js'}, function() { 
			chrome.tabs.executeScript(null, {file: 'main.js'});
		});
	}
});

