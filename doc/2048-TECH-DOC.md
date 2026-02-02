# 2048 游戏技术文档

## 1. 项目概述

### 1.1 项目简介
基于 Vue.js 实现的经典数字消除游戏 2048，支持键盘方向键和触屏滑动操作。

### 1.2 核心功能
- 4x4 数字棋盘游戏
- 键盘方向键控制
- 触屏滑动控制
- 分数统计
- 最高分记录（localStorage）
- 游戏结束判定
- 重新开始功能
- 动画效果

## 2. 技术栈

### 2.1 前端框架
- Vue.js 3.x
- TypeScript
- Vite（构建工具）

### 2.2 UI 样式
- CSS3
- 动画效果

### 2.3 状态管理
- Vue 3 Composition API
- reactive/ref 响应式数据

### 2.4 开发工具
- ESLint
- Prettier

## 3. 项目结构

```
2048-game/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── GameBoard.vue      # 游戏棋盘组件
│   │   ├── Tile.vue           # 数字方块组件
│   │   ├── ScoreBoard.vue     # 分数板组件
│   │   ├── GameOver.vue       # 游戏结束弹窗
│   │   └── Controls.vue       # 控制按钮
│   ├── composables/
│   │   └── useGameLogic.ts    # 游戏逻辑组合函数
│   ├── utils/
│   │   ├── board.ts           # 棋盘操作工具
│   │   ├── move.ts            # 移动逻辑工具
│   │   └── storage.ts         # 本地存储工具
│   ├── types/
│   │   └── game.ts            # 类型定义
│   ├── App.vue                # 根组件
│   ├── main.ts                # 入口文件
│   └── style.css              # 全局样式
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 4. 核心模块设计

### 4.1 数据结构

#### 4.1.1 Board（棋盘）
```typescript
type Board = number[][];  // 4x4 二维数组，0表示空格
```

#### 4.1.2 Tile（数字块）
```typescript
interface Tile {
  value: number;      // 数字值 (2, 4, 8, 16...)
  x: number;          // x 坐标 (0-3)
  y: number;          // y 坐标 (0-3)
  id: string;         // 唯一标识
  merged: boolean;    // 是否刚合并过
}
```

#### 4.1.3 GameState（游戏状态）
```typescript
interface GameState {
  board: Board;
  score: number;
  bestScore: number;
  gameOver: boolean;
  won: boolean;
}
```

### 4.2 游戏逻辑模块

#### 4.2.1 Board Manager
- 初始化棋盘
- 生成新数字块（2 或 4，概率 90%/10%）
- 检查空位
- 获取可用位置

#### 4.2.2 Move Logic
- 向上移动
- 向下移动
- 向左移动
- 向右移动
- 数字合并逻辑
- 判断是否移动成功

#### 4.2.3 Game Controller
- 处理输入事件
- 执行移动
- 更新分数
- 判定游戏结束
- 判定胜利（达到2048）

#### 4.2.4 Storage Manager
- 保存最高分
- 读取最高分
- 保存游戏状态（可选）

## 5. 游戏算法

### 5.1 移动算法

**向左移动示例：**
```
原状态: [2, 0, 2, 0]
1. 移除空格: [2, 2]
2. 合并相同: [4]
3. 补齐空格: [4, 0, 0, 0]
```

**算法步骤：**
1. 移除该行/列中的所有 0（空格）
2. 从左到右遍历，合并相邻相同数字
3. 合并后的数字只参与一次合并
4. 补齐空位到 4 个元素
5. 判断是否发生实际移动

### 5.2 生成新块算法
1. 遍历棋盘，收集所有空位坐标
2. 随机选择一个空位
3. 生成数字：90% 概率为 2，10% 概率为 4

### 5.3 游戏结束判定
1. 棋盘已满
2. 且所有相邻方向都无法合并（上下左右）

## 6. 组件设计

### 6.1 GameBoard.vue
**职责：**
- 渲染 4x4 棋盘
- 处理键盘和触摸事件
- 渲染 Tile 子组件

**Props：**
- board: Board
- tileSize: number

**Events：**
- move: direction (方向)

### 6.2 Tile.vue
**职责：**
- 渲染单个数字块
- 显示对应数字和颜色
- 处理出现和合并动画

**Props：**
- value: number
- x: number
- y: number
- merged: boolean

### 6.3 ScoreBoard.vue
**职责：**
- 显示当前分数
- 显示最高分数

**Props：**
- score: number
- bestScore: number

### 6.4 GameOver.vue
**职责：**
- 显示游戏结束/胜利信息
- 提供重新开始按钮

**Props：**
- gameOver: boolean
- won: boolean

**Events：**
- restart

### 6.5 Controls.vue
**职责：**
- 提供重新开始按钮
- 提供方向控制按钮（移动端）

**Events：**
- restart
- move: direction

## 7. 样式设计

### 7.1 颜色方案
```css
数字块颜色:
2: #eee4da
4: #ede0c8
8: #f2b179
16: #f59563
32: #f67c5f
64: #f65e3b
128: #edcf72
256: #edcc61
512: #edc850
1024: #edc53f
2048: #edc22e
```

### 7.2 响应式设计
- 桌面端：固定尺寸 500x500px
- 移动端：自适应屏幕宽度，最大 500px

## 8. 开发规范

### 8.1 代码风格
- 使用 TypeScript 严格模式
- 遵循 Vue 3 Composition API 风格
- 组件使用 `<script setup>` 语法
- 命名规范：PascalCase 组件，camelCase 变量/函数

### 8.2 Git 提交规范
```
feat: 新功能
fix: 修复bug
style: 样式调整
refactor: 重构
docs: 文档更新
test: 测试
chore: 构建/工具配置
```

### 8.3 测试
- 单元测试：核心逻辑函数
- 组件测试：主要组件

## 9. 性能优化

### 9.1 计算属性缓存
使用 computed 缓存棋盘状态计算结果

### 9.2 动画优化
使用 CSS transform 和 transition 实现流畅动画

### 9.3 按键防抖
对连续快速按键进行防抖处理

## 10. 部署方案

### 10.1 开发环境
```bash
npm run dev
```

### 10.2 生产构建
```bash
npm run build
```

### 10.3 部署
- 静态文件部署到 CDN 或静态服务器
- 支持 Nginx、Vercel、Netlify 等

## 11. 扩展功能（可选）

- 撤销功能
- 游戏记录回放
- 难度选择（4x4, 5x5, 6x6）
- 皮肤主题切换
- 排行榜（需要后端支持）
- 音效
- 深色模式

## 12. 开发时间估算

- 项目搭建：1小时
- 核心逻辑开发：2小时
- UI 组件开发：2小时
- 动画效果：1小时
- 测试和优化：1小时
- **总计：7小时**

## 13. 版本历史

- v1.0.0：基础版本，核心游戏功能
