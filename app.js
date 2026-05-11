// === CONTRACT MARKERS (auto-injected for traceability) ===
// CONTRACT: primary-action-button
// === END CONTRACT MARKERS ===

(function() {
  var messageInput = document.getElementById("messageInput");
  var sendBtn = document.getElementById("sendBtn");
  var messageList = document.getElementById("messageList");
  var emptyState = document.getElementById("emptyState");
  var formError = document.getElementById("formError");
  var usernameInput = document.getElementById("usernameInput");
  var roomSelect = document.getElementById("roomSelect");
  var currentRoomLabel = document.getElementById("currentRoom");
  var currentRoom = "general";
  var pollTimer = null;

  function getUsername() {
    return (usernameInput.value || "").trim() || "Anonymous";
  }

  function showError(msg) {
    formError.textContent = msg;
    formError.style.display = "block";
    setTimeout(function() { formError.style.display = "none"; }, 3000);
  }

  function escHtml(str) {
    var d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  function formatTime(ts) {
    var d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function renderMessages(messages) {
    if (!messages || messages.length === 0) {
      messageList.innerHTML = "";
      messageList.appendChild(emptyState);
      emptyState.style.display = "flex";
      return;
    }
    emptyState.style.display = "none";
    var myName = getUsername();
    messageList.innerHTML = messages.map(function(msg) {
      var isSelf = msg.username === myName;
      return '<div class="flex flex-col ' + (isSelf ? "items-end" : "items-start") + '">' +
        '<div class="msg-username ' + (isSelf ? "text-indigo-600" : "text-gray-700") + '">' + escHtml(msg.username || "Anonymous") + '</div>' +
        '<div class="msg-bubble ' + (isSelf ? "self" : "other") + '">' + escHtml(msg.content) + '</div>' +
        '<div class="msg-meta">' + formatTime(msg.created_at) + '</div>' +
        '</div>';
    }).join("");
    messageList.scrollTop = messageList.scrollHeight;
  }

  function loadMessages() {
    fetch("/api/messages?room=" + encodeURIComponent(currentRoom))
      .then(function(r) { return r.json(); })
      .then(function(data) { if (data.success) renderMessages(data.messages); })
      .catch(function() {});
  }

  function sendMessage() {
    var content = messageInput.value.trim();
    if (!content) { showError("Message cannot be empty"); messageInput.focus(); return; }
    sendBtn.disabled = true;
    fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: content, room: currentRoom, username: getUsername() })
    })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.success) { messageInput.value = ""; loadMessages(); }
        else { showError(data.message || "Failed to send"); }
      })
      .catch(function() { showError("Network error"); })
      .finally(function() { sendBtn.disabled = false; messageInput.focus(); });
  }

  sendBtn.addEventListener("click", sendMessage);
  messageInput.addEventListener("keydown", function(e) { if (e.key === "Enter") sendMessage(); });

  roomSelect.addEventListener("change", function() {
    currentRoom = roomSelect.value;
    currentRoomLabel.textContent = currentRoom;
    loadMessages();
  });

  // Poll for new messages every 3 seconds
  function startPolling() {
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = setInterval(loadMessages, 3000);
  }

  loadMessages();
  startPolling();
})();