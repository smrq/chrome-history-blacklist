chrome.storage.sync.get('blacklist', data => {
	if (!data.blacklist) {
		throw new Error('expected blacklist in storage');
	}

	const blacklistEl = document.getElementById('blacklist');
	blacklistEl.value = data.blacklist.join('\n');
});

chrome.storage.sync.get(['urlsPurged', 'startDate'], data => {
	if (data.urlsPurged == null) {
		throw new Error('expected urlsPurged in storage');
	}
	if (data.startDate == null) {
		throw new Error('expected startDate in storage');
	}

	document.getElementById('urls-purged').innerHTML = data.urlsPurged.toLocaleString();
	document.getElementById('urls-purged-date').innerHTML = new Date(data.startDate).toLocaleDateString();

	if (data.urlsPurged > 0) {
		document.getElementById('urls-purged-container').className = 'show';
	}
});

const saveEl = document.getElementById('save');
saveEl.addEventListener('click', function () {
	const blacklistEl = document.getElementById('blacklist');
	const blacklist = blacklistEl.value.trim().split('\n');
	chrome.storage.sync.set({ blacklist });

	const savedNotificationEl = document.getElementById('saved-notification');
	savedNotificationEl.className = 'flash';
	savedNotificationEl.offsetWidth;
	savedNotificationEl.className = '';
});
