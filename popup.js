// load the values from local storage
chrome.storage.sync.get('chat', ({ chat }) => {
  const option = document.getElementById('chat')[0];
  option.value = chat;
  option.innerHTML = chat;
});
chrome.storage.sync.get('ui', ({ ui }) => {
  const option = document.getElementById('ui')[0];
  option.value = ui;
  option.innerHTML = ui;
});

// save the new value to local storage
document.getElementById('chat').addEventListener('change', async (e) => {
  const chat = e.path[0].value;
  chrome.storage.sync.set({ chat });
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  chrome.runtime.sendMessage({ id: 'chat', dir: chat, tabId: tab.id });
});

document.getElementById('ui').addEventListener('change', async (e) => {
  const ui = e.path[0].value;
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  chrome.storage.sync.set({ ui });
  chrome.runtime.sendMessage({ id: 'ui', dir: ui, tabId: tab.id });
});
