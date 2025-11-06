/**
 * UI 管理模組
 * 處理使用者介面相關操作
 */

let messageArea;
let userAvatar, userName, userLogin;

/**
 * 初始化 UI 模組
 */
export function initUI() {
    messageArea = document.getElementById('message-area');
    userAvatar = document.getElementById('user-avatar');
    userName = document.getElementById('user-name');
    userLogin = document.getElementById('user-login');
}

/**
 * 顯示訊息
 */
export function showMessage(message, type = 'error') {
    messageArea.innerHTML = `<div class="${type}">${message}</div>`;
    setTimeout(() => {
        messageArea.innerHTML = '';
    }, 5000);
}

/**
 * 顯示成功訊息
 */
export function showSuccess(message) {
    showMessage(message, 'success');
}

/**
 * 顯示錯誤訊息
 */
export function showError(message) {
    showMessage(message, 'error');
}

/**
 * 顯示使用者資訊
 */
export function displayUserInfo(user) {
    if (userAvatar && userName && userLogin) {
        userAvatar.src = user.avatar_url;
        userName.textContent = user.name || user.login;
        userLogin.textContent = `@${user.login}`;
    }
}

/**
 * 清除使用者資訊
 */
export function clearUserInfo() {
    if (userAvatar && userName && userLogin) {
        userAvatar.src = '';
        userName.textContent = '';
        userLogin.textContent = '';
    }
}
