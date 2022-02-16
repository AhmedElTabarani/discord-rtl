const changeCSS = (op, path, tabId) => {
  console.log('ChangeCSS', op, path, tabId);
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

const getCurrentTab = async () => {
  console.log('getCurrentTab');
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  return tab;
};

const loadNewValuesFromStorage = async () => {
  console.log('loadNewValuesFromStorage');
  const { chat } = await chrome.storage.sync.get('chat');
  const { ui } = await chrome.storage.sync.get('ui');
  return { chat, ui };
};

const applyNewValuesForDiscord = async (tab) => {
  console.log('applyNewValuesForDiscord');
  if (!tab.url.includes('https://discord.com/')) return;
  const { chat, ui } = await loadNewValuesFromStorage();
  changeCSS(chat, 'chat-rtl.css', tab.id);
  changeCSS(ui, 'ui-rtl.css', tab.id);
};
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  console.log('onUpdated');
  if (changeInfo.status == 'loading') await applyNewValuesForDiscord(tab);
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  console.log('onActivated');
  const tab = await getCurrentTab();
  await applyNewValuesForDiscord(tab);
});

chrome.runtime.onMessage.addListener(async ({ func }, sender, sendResponse) => {
  console.log('onMessage', func);
  if (func != 'changeCSS') return;
  const tab = await getCurrentTab();
  await applyNewValuesForDiscord(tab);
});
