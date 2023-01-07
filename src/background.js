chrome.runtime.onInstalled.addListener(handleRuntimeInstalled);
chrome.history.onVisited.addListener(handleHistoryVisited);

function handleRuntimeInstalled(details) {
	if (details.reason === 'install') {
		chrome.storage.sync.set({
			blacklist: [],
			urlsPurged: 0,
			startDate: Date.now()
		}, () => {
			console.log('Blacklist initialized.');
		});
	}
}

function handleHistoryVisited(historyItem) {
	chrome.storage.sync.get('blacklist', data => {
		if (isBlacklisted(data.blacklist, historyItem.url)) {
			console.log(`Blacklisted URL: ${historyItem.url}`);
			purgeUrl(historyItem.url, historyItem.title);
		}
	});
}

function purgeUrl(url) {
	chrome.history.deleteUrl({ url }, () => {
		console.log(`History deleted for URL: ${url}`);
		incrementCount();
	});
}

function incrementCount() {
	chrome.storage.sync.get('urlsPurged', data => {
		chrome.storage.sync.set({
			urlsPurged: data.urlsPurged + 1
		});
	});
}

function isBlacklisted(blacklist, url, title) {
	return blacklist.some(line => url.toLowerCase().includes(line.toLowerCase())) || blacklist.some(line => title.toLowerCase().includes(line.toLowerCase()));
}
