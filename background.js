const changeCSS = (op, path, tabId) => {
  console.log('ChangeCSS', op, path, tabId);
  if (op == 'RTL')
    chrome.scripting.insertCSS(
      {
        target: { tabId },
        files: [`css/${path}`],
      },
      () => {
        console.log(`CSS file ${path} inserted`);
      }
    );
  else if (op == 'LTR')
    chrome.scripting.removeCSS(
      {
        target: { tabId },
        files: [`css/${path}`],
      },
      () => {
        console.log(`CSS file ${path} removed`);
      }
    );
};

const getCurrentTab = async () => {
  console.log('getCurrentTab');
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  return tab;
};

const loadNewValueFromStorage = async (id) => {
  console.log('loadNewValueFromStorage', id);
  const value = await chrome.storage.sync.get(id);
  return value[id];
};

const applyNewValueForDiscord = async (tab, id) => {
  console.log('applyNewValueForDiscord', id);

  const value = await loadNewValueFromStorage(id);
  changeCSS(value, `${id}-rtl.css`, tab.id);
};
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log('onUpdated');

  if (!tab.url.includes('https://discord.com/')) return;

  if (changeInfo.status == 'loading') {
    Promise.all([
      applyNewValueForDiscord(tab, 'chat'),
      applyNewValueForDiscord(tab, 'ui'),
    ]);
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  console.log('onActivated');

  const tab = await getCurrentTab();
  if (!tab.url.includes('https://discord.com/')) return;

  Promise.all([
    applyNewValueForDiscord(tab, 'chat'),
    applyNewValueForDiscord(tab, 'ui'),
  ]);
});

chrome.runtime.onMessage.addListener(async ({ id }, sender, sendResponse) => {
  console.log('onMessage', id);
  const tab = await getCurrentTab();
  applyNewValueForDiscord(tab, id);
});
