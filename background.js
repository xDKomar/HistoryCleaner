var tabToUrl = {};
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	tabToUrl[tabId] = tab.url;
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
	let tabUrl = tabToUrl[tabId];

	if (tabUrl === undefined) {
		return;
	}

	chrome.storage.local.get({ sites: [] }, (data) => {
		const sites = data.sites;
		if (sites.length > 0) {
			const siteToClear = sites.find((site) => tabUrl.includes(site));
			if (siteToClear) {
				chrome.history.deleteUrl({ url: 'http://' + siteToClear}, function () { })
				chrome.history.deleteUrl({ url: 'https://' + siteToClear}, function () { })
				chrome.history.search(
					{ text: siteToClear, startTime: 0, maxResults: 0 },
					function (results) {
						results.forEach(function (page) {
							if (page.url.indexOf(siteToClear) > -1) {
								chrome.history.deleteUrl({ url: page.url }, function () {
									if (chrome.runtime.lastError) {
										console.error(
											`Error removing ${page.url}: ${chrome.runtime.lastError}`
										);
									} 
								});
							}
						});
					}
				);
			}
		}
	});

	delete tabToUrl[tabId];
});
