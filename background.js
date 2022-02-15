const changeCSS = (op, path, tabId) => {
  if (op == 'RTL')
    chrome.scripting.insertCSS({
      target: { tabId },
      files: [`css/${path}`],
    });
  else if (op == 'LTR')
    chrome.scripting.removeCSS({
      target: { tabId },
      files: [`css/${path}`],
    });
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url.includes('https://discord.com/')) {
    if (changeInfo.status == 'loading') {
      chrome.storage.sync.get('chat', ({ chat }) => {
        changeCSS(chat, 'chat-rtl.css', tabId);
      });
      chrome.storage.sync.get('ui', ({ ui }) => {
        changeCSS(ui, 'ui-rtl.css', tabId);
      });
    }
  }
});

chrome.runtime.onMessage.addListener(
  async ({ id, dir }, sender, sendResponse) => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab.url.includes('https://discord.com/')) {
      if (id == 'chat') changeCSS(dir, 'chat-rtl.css', tab.id);
      else if (id == 'ui') changeCSS(dir, 'ui-rtl.css', tab.id);
    }
  }
);
``