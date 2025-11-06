/**
 * 主應用程式
 * 整合所有模組並初始化應用程式
 */

import { initAuth } from './auth.js';
import { initRepo } from './repo.js';
import { initUI, showMessage, showSuccess, showError, displayUserInfo, clearUserInfo } from './ui.js';

/**
 * 應用程式初始化
 */
function initApp() {
    // 初始化 UI 模組
    initUI();

    // 初始化認證模組
    initAuth({
        onAuthSuccess: handleAuthSuccess,
        onAuthFail: handleAuthFail
    });

    // 初始化 Repo 模組
    initRepo({
        onRepoFetchSuccess: handleRepoFetchSuccess,
        onRepoFetchFail: handleRepoFetchFail
    });

    // 監聽登出事件
    window.addEventListener('auth:logout', handleLogout);
}

/**
 * 處理認證成功
 */
function handleAuthSuccess(user) {
    displayUserInfo(user);
    showSuccess('✅ 登入成功！');
}

/**
 * 處理認證失敗
 */
function handleAuthFail(errorMessage) {
    showError(errorMessage);
}

/**
 * 處理 Repo 取得成功
 */
function handleRepoFetchSuccess(repoData) {
    showSuccess(`✅ 成功取得 ${repoData.fileCount} 個項目`);
}

/**
 * 處理 Repo 取得失敗
 */
function handleRepoFetchFail(errorMessage) {
    showError(errorMessage);
}

/**
 * 處理登出
 */
function handleLogout() {
    clearUserInfo();
    showSuccess('已登出');
}

// 當 DOM 載入完成時初始化應用程式
window.addEventListener('DOMContentLoaded', initApp);
