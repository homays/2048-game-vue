# 2048 Game

基于 Vue 3 + TypeScript + Vite 构建的 2048 游戏。

> 🚀 **Vibe Coding Project**  
> 本项目采用 Vibe Coding 方式开发，代码由 AI（Claude）辅助生成。  
> 通过自然语言描述需求，AI 帮助完成代码编写、调试和优化。

## 功能特性

- 4x4 数字棋盘游戏
- 键盘方向键控制（支持 WASD）
- 触屏滑动控制
- 分数统计和最高分记录（localStorage）
- 游戏结束判定
- 胜利判定（达到2048）
- 重新开始功能
- 动画效果
- 响应式设计（支持移动端）
- 全局缩放设置（70% - 200%）

## 安装依赖

```bash
npm install
```

## 开发运行

```bash
npm run dev
```

访问 http://localhost:3000

## 生产构建

```bash
npm run build
```

## 技术栈

- Vue 3（Composition API）
- TypeScript
- Vite

## 项目结构

```
src/
├── components/        # Vue组件
│   ├── GameBoard.vue   # 游戏棋盘
│   ├── Tile.vue        # 数字方块
│   ├── ScoreBoard.vue  # 分数板
│   ├── GameOver.vue    # 游戏结束弹窗
│   ├── Controls.vue    # 控制按钮
│   └── Settings.vue    # 设置面板
├── composables/       # 组合函数
│   └── useGameLogic.ts # 游戏逻辑
├── utils/            # 工具函数
│   ├── board.ts       # 棋盘操作
│   ├── move.ts        # 移动逻辑
│   └── storage.ts     # 本地存储
├── types/            # 类型定义
│   └── game.ts        # 游戏类型
├── App.vue           # 根组件
├── main.ts           # 入口文件
└── style.css         # 全局样式
```

## 游戏规则

1. 使用方向键或滑动屏幕移动方块
2. 相同数字的方块碰撞时会合并
3. 每次移动后随机生成一个2或4
4. 合并相同数字得分
5. 达到2048即为胜利
6. 棋盘填满且无法移动时游戏结束

## 开发说明

### AI 辅助开发

本项目全程使用 AI 辅助开发：
- 🤖 **代码生成**：核心游戏逻辑、UI 组件由 AI 生成
- 🎨 **样式设计**：配色方案、动画效果由 AI 建议
- 🐛 **Bug 修复**：问题诊断和修复方案由 AI 提供
- ✨ **功能迭代**：新功能（设置面板、缩放等）由 AI 实现
