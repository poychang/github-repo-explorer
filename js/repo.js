/**
 * Repository 管理模組
 * 處理 GitHub Repo 相關操作
 */

import { getOctokit } from './auth.js';

let repoUrlInput, fetchFilesBtn, resultSection, fileList;
let onRepoFetchSuccess = null;
let onRepoFetchFail = null;

/**
 * 初始化 Repo 模組
 */
export function initRepo(config) {
    repoUrlInput = document.getElementById('repo-url');
    fetchFilesBtn = document.getElementById('fetch-files-btn');
    resultSection = document.getElementById('result-section');
    fileList = document.getElementById('file-list');

    // 設定回調
    if (config.onRepoFetchSuccess) onRepoFetchSuccess = config.onRepoFetchSuccess;
    if (config.onRepoFetchFail) onRepoFetchFail = config.onRepoFetchFail;

    // 綁定事件
    fetchFilesBtn.addEventListener('click', fetchRepoFiles);
    
    // 支援 Enter 鍵送出
    repoUrlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            fetchRepoFiles();
        }
    });

    // 監聽登出事件
    window.addEventListener('auth:logout', handleLogout);
}

/**
 * 處理登出事件
 */
function handleLogout() {
    resultSection.classList.add('hidden');
    repoUrlInput.value = '';
    fileList.innerHTML = '';
}

/**
 * 解析 GitHub Repo URL
 */
function parseRepoUrl(url) {
    try {
        const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
        const match = url.match(regex);
        if (match) {
            return {
                owner: match[1],
                repo: match[2].replace('.git', '')
            };
        }
        return null;
    } catch (error) {
        return null;
    }
}

/**
 * 取得檔案圖示
 */
function getFileIcon(type, name) {
    if (type === 'dir') return '📁';
    
    const ext = name.split('.').pop().toLowerCase();
    const iconMap = {
        'js': '📜',
        'ts': '📘',
        'json': '📋',
        'html': '🌐',
        'css': '🎨',
        'md': '📝',
        'txt': '📄',
        'py': '🐍',
        'java': '☕',
        'php': '🐘',
        'rb': '💎',
        'go': '🐹',
        'rs': '🦀',
        'c': '©️',
        'cpp': '©️',
        'sh': '🐚',
        'yml': '⚙️',
        'yaml': '⚙️',
        'xml': '📰',
        'sql': '🗄️',
        'png': '🖼️',
        'jpg': '🖼️',
        'jpeg': '🖼️',
        'gif': '🖼️',
        'svg': '🎨',
        'ico': '🖼️',
        'pdf': '📕',
        'zip': '📦',
        'tar': '📦',
        'gz': '📦'
    };
    
    return iconMap[ext] || '📄';
}

/**
 * 取得儲存庫檔案列表
 */
async function fetchRepoFiles() {
    const octokit = getOctokit();
    
    if (!octokit) {
        if (onRepoFetchFail) {
            onRepoFetchFail('請先登入 GitHub');
        }
        return;
    }

    const repoUrl = repoUrlInput.value.trim();
    
    if (!repoUrl) {
        if (onRepoFetchFail) {
            onRepoFetchFail('請輸入 GitHub Repo URL');
        }
        return;
    }

    const repoInfo = parseRepoUrl(repoUrl);
    if (!repoInfo) {
        if (onRepoFetchFail) {
            onRepoFetchFail('無效的 GitHub Repo URL');
        }
        return;
    }

    try {
        fetchFilesBtn.disabled = true;
        fileList.innerHTML = '<div class="loading"><div class="spinner"></div><p>載入中...</p></div>';
        resultSection.classList.remove('hidden');

        // 取得預設分支的檔案樹
        const { data: repo } = await octokit.request('GET /repos/{owner}/{repo}', {
            owner: repoInfo.owner,
            repo: repoInfo.repo
        });

        const { data: tree } = await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
            owner: repoInfo.owner,
            repo: repoInfo.repo,
            tree_sha: repo.default_branch
        });

        // 顯示檔案列表
        if (tree.tree.length === 0) {
            fileList.innerHTML = '<p class="instruction">此儲存庫沒有檔案</p>';
        } else {
            fileList.innerHTML = tree.tree.map(item => `
                <div class="file-item">
                    <span class="file-icon">${getFileIcon(item.type, item.path)}</span>
                    <span class="file-name">${item.path}</span>
                    <span class="file-type">${item.type === 'tree' ? 'folder' : 'file'}</span>
                </div>
            `).join('');
        }

        if (onRepoFetchSuccess) {
            onRepoFetchSuccess({
                owner: repoInfo.owner,
                repo: repoInfo.repo,
                fileCount: tree.tree.length,
                defaultBranch: repo.default_branch
            });
        }

    } catch (error) {
        if (onRepoFetchFail) {
            onRepoFetchFail('取得檔案列表失敗：' + error.message);
        }
        fileList.innerHTML = '';
    } finally {
        fetchFilesBtn.disabled = false;
    }
}

/**
 * 清除結果
 */
export function clearResults() {
    resultSection.classList.add('hidden');
    fileList.innerHTML = '';
    repoUrlInput.value = '';
}
