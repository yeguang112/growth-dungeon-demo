# 成长副本 30-60-90 学习路径设计器

面向 AI Native 游戏组织的新人成长 Demo。HR 或导师可以根据新人岗位、AI 基础、业务目标生成 30/60/90 三阶段学习路径，并查看任务卡、导师动作、AI 工具建议与验收指标。

## 核心体验

- 路径生成器：选择新人角色、AI 基础、核心目标，生成个性化 90 天学习副本。
- 30-60-90 副本地图：切换 30/60/90 阶段，查看目标、风险和通关条件。
- 任务详情：展示投入时间、AI 工具、交付物、导师动作和 Prompt Starter。
- 导师看板：切换新人/导师视角，追踪完成进度和带教节奏。
- 响应式体验：支持宽屏 PC、普通笔记本和手机端访问。

## 本地运行

```bash
npm install
npm run dev
```

## 构建校验

```bash
npm run lint
npm run build
```

## 公网部署

推荐使用 GitHub + Vercel：

1. 新建 GitHub 仓库，例如 `growth-dungeon-demo`。
2. 将本项目 push 到仓库。
3. 在 Vercel 导入仓库。
4. Framework 选择 `Vite`，Build Command 使用 `npm run build`，Output Directory 使用 `dist`。
5. 部署完成后即可获得公网访问链接。

项目已内置 `vercel.json`，支持后续扩展前端路由时刷新页面不 404。
