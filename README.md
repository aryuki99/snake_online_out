# 响应式贪吃蛇游戏

一个基于Next.js开发的响应式贪吃蛇游戏，支持PC和移动设备，可以部署在Vercel平台上。

## 功能特点

- 响应式布局，自适应不同屏幕尺寸
- 可调整游戏难度（蛇移动速度）
- 可调整游戏格子数量（n×n）
- 支持键盘方向键和WASD控制
- 支持触摸屏滑动控制
- 屏幕方向键控制
- 移动设备优化，防止页面滚动
- 游戏暂停/继续功能
- 分数统计

## 技术栈

- Next.js 14
- React 18
- CSS Modules
- Vercel部署

## 本地开发

确保你的Node.js版本为22.x，然后按照以下步骤操作：

1. 克隆仓库

```bash
git clone <仓库地址>
cd snake-game
```

2. 安装依赖

```bash
npm install
```

3. 启动开发服务器

```bash
npm run dev
```

4. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 构建和部署

### 本地构建

```bash
npm run build
npm start
```

### 部署到Vercel

最简单的部署方式是使用Vercel平台：

1. 在GitHub上创建一个新仓库并推送代码
2. 在Vercel上导入该仓库
3. 确保Node.js版本设置为22.x
4. 点击部署

或者使用Vercel CLI：

```bash
npm install -g vercel
vercel login
vercel
```

## 游戏操作

- **键盘控制**：方向键或WASD键
- **触摸控制**：在游戏区域滑动（上下左右）
- **屏幕按钮**：点击屏幕下方的方向按钮
- **暂停游戏**：按空格键
- **设置**：点击右上角的设置图标，可调整游戏大小和速度

## 游戏规则

1. 控制蛇移动，吃到食物后蛇身会变长，得分增加
2. 撞到墙壁或自己的身体游戏结束
3. 游戏难度随着速度增加而提高

## 许可证

MIT