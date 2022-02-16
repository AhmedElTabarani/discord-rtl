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
  await chrome.storage.sync.set({ chat });
  await chrome.runtime.sendMessage({ func: "changeCSS" });
});

document.getElementById('ui').addEventListener('change', async (e) => {
  const ui = e.path[0].value;
  await chrome.storage.sync.set({ ui });
  await chrome.runtime.sendMessage({ func: "changeCSS" });
});
