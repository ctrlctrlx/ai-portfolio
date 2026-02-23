#!/bin/bash

# 开启防暴毙模式：遇到任何错误立刻停止执行
set -e

# 定义终端颜色变量 (装逼与实用并存)
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # 恢复默认颜色

echo -e "${YELLOW}🚀 启动自动化代码推送流水线...${NC}"

# 【细节1】智能拦截：检查是否有文件被修改
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${RED}🛑 拦截：当前代码没有任何修改，无需推送！${NC}"
    exit 0
fi

# 1. 将所有改动添加到暂存区
git add .

# 【细节2】灵活的 Commit 备注机制
# 检查执行脚本时是否带了参数 (例如: bash push.sh "修复了表格bug")
if [ -n "$1" ]; then
    COMMIT_MSG="$1"
else
    # 如果没带参数，就在终端里停下来问你
    echo -e "${YELLOW}✏️  请输入本次更新的内容 (直接回车将使用默认时间戳): ${NC}"
    read user_input
    
    if [ -z "$user_input" ]; then
        # 兜底机制：如果你连回车都懒得敲，就用时间戳
        COMMIT_MSG="auto-update: $(date '+%Y-%m-%d %H:%M:%S')"
    else
        COMMIT_MSG="$user_input"
    fi
fi

# 2. 执行存档
git commit -m "$COMMIT_MSG"

# 3. 确保是在 main 分支
git branch -M main

# 4. 尝试连接远程仓库 (屏蔽重复关联的警告)
git remote add origin https://github.com/ctrlctrlx/ai-portfolio.git 2>/dev/null || true

# 5. 正式推送
echo -e "${YELLOW}📡 正在与云端 GitHub 同步数据...${NC}"
git push -u origin main

echo -e "${GREEN}✅ 同步完美结束！代码已安全落地云端。${NC}"