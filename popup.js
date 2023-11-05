document.addEventListener('DOMContentLoaded', () => {
	const saveButton = document.getElementById('saveButton');
	const siteList = document.getElementById('siteList');
      
	// Load saved sites from storage and display them
	chrome.storage.local.get({ sites: [] }, (data) => {
	  siteList.value = data.sites.join('\n');
	});
      
	// Save the sites when the save button is clicked
	saveButton.addEventListener('click', () => {
	  const sites = siteList.value.split('\n').map(s => s.trim()).filter(Boolean);
	  chrome.storage.local.set({ sites }, () => {
	    console.log('Sites saved successfully!');
	  });
	});
      });