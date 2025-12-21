# GitHub 部署指南

## 📋 步骤说明

### 1. 配置 Git 用户信息（如果还没有配置）

在命令行中运行以下命令（替换为你的GitHub信息）：

```bash
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的GitHub邮箱"
```

### 2. 在 GitHub 上创建新仓库

1. 登录 GitHub
2. 点击右上角的 "+" 号，选择 "New repository"
3. 输入仓库名称（例如：`snake-game`）
4. 选择 Public 或 Private
5. **不要**勾选 "Initialize this repository with a README"
6. 点击 "Create repository"

### 3. 连接本地仓库到 GitHub

创建仓库后，GitHub会显示连接命令。运行以下命令（替换为你的仓库地址）：

```bash
git remote add origin https://github.com/你的用户名/仓库名.git
git branch -M main
git push -u origin main
```

### 4. 或者使用 SSH（如果已配置SSH密钥）

```bash
git remote add origin git@github.com:你的用户名/仓库名.git
git branch -M main
git push -u origin main
```

## 🚀 快速命令（复制粘贴使用）

```bash
# 1. 配置用户信息（只需运行一次）
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的GitHub邮箱"

# 2. 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/仓库名.git

# 3. 推送到GitHub
git branch -M main
git push -u origin main
```

## 📝 后续更新

如果以后修改了代码，使用以下命令更新：

```bash
git add .
git commit -m "更新说明"
git push
```

## 💡 提示

- 如果遇到认证问题，GitHub现在使用Personal Access Token而不是密码
- 可以在 GitHub Settings > Developer settings > Personal access tokens 创建token
- 推送时使用token作为密码

