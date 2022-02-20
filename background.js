const changeCSS = async (op, path, tabId) => {
  console.log('ChangeCSS', op, path, tabId);
  if (op == 'RTL')
    await chrome.scripting.insertCSS({
      target: { tabId },
      files: [`css/${path}`],
    });
  else if (op == 'LTR')
    await chrome.scripting.removeCSS({
      target: { tabId },
      files: [`css/${path}`],
    });
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
  if (id == 'chat') {
    const { chat } = await chrome.storage.sync.get('chat');
    return { value: chat };
  } else if (id == 'ui') {
    const { ui } = await chrome.storage.sync.get('ui');
    return { value: ui };
  }
};

const applyNewValueForDiscord = async (tab, id) => {
  console.log('applyNewValueForDiscord', id);
  if (!tab.url.includes('https://discord.com/')) return;
  if (id == 'chat') {
    const { value } = await loadNewValueFromStorage(id);
    await changeCSS(value, 'chat-rtl.css', tab.id);
  } else if (id == 'ui') {
    const { value } = await loadNewValueFromStorage(id);
    await changeCSS(value, 'ui-rtl.css', tab.id);
  }
};
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  console.log('onUpdated');
  if (changeInfo.status == 'loading') {
    await applyNewValueForDiscord(tab, 'chat');
    await applyNewValueForDiscord(tab, 'ui');
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  console.log('onActivated');
  const tab = await getCurrentTab();
  await applyNewValueForDiscord(tab, 'chat');
  await applyNewValueForDiscord(tab, 'ui');
});

chrome.runtime.onMessage.addListener(
  async ({ func, id }, sender, sendResponse) => {
    console.log('onMessage', func);
    if (func != 'changeCSS') return;
    const tab = await getCurrentTab();
    await applyNewValueForDiscord(tab, id);
  }
);
