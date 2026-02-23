param(
    [string]$msg = ""
)

$ErrorActionPreference = 'Stop'

Write-Host "🚀 启动自动化代码推送流水线..." -ForegroundColor Yellow

# 检查是否有文件修改
$status = git status --porcelain
if (-not $status) {
    Write-Host "🛑 拦截：当前代码没有任何修改，无需推送！" -ForegroundColor Red
    exit
}

# 1. 添加到暂存区
git add .

# 2. 处理 Commit 备注
if ($msg -eq "") {
    $msg = Read-Host "✏️ 请输入本次更新的内容 (直接回车将使用默认时间戳)"
    if ($msg -eq "") {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        $msg = "auto-update: $timestamp"
    }
}

# 3. 提交代码
git commit -m $msg

# 4. 锁定分支与关联 (静默处理重复关联的报错)
git branch -M main
git remote add origin https://github.com/ctrlctrlx/ai-portfolio.git 2>$null

# 5. 正式推送
Write-Host "📡 正在与云端 GitHub 同步数据..." -ForegroundColor Yellow
git push -u origin main

Write-Host "✅ 同步完美结束！代码已安全落地云端。" -ForegroundColor Green