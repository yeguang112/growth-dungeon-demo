import { useMemo, useState } from 'react'
import './App.css'

type RoleKey = 'designer' | 'pm' | 'engineer' | 'hr'
type LevelKey = 'starter' | 'user' | 'builder'
type StageKey = '30' | '60' | '90'
type FocusKey = 'pipeline' | 'tooling' | 'culture' | 'delivery'
type ViewKey = 'home' | 'forge' | 'map' | 'room' | 'mentor'

type Task = {
  id: string
  title: string
  type: string
  effort: string
  output: string
  mentor: string
  aiTool: string
  reward: string
}

type Stage = {
  key: StageKey
  title: string
  theme: string
  roomName: string
  goal: string
  checkpoint: string
  risk: string
  tasks: Task[]
}

type Plan = {
  roleName: string
  archetype: string
  narrative: string
  powerUps: string[]
  stages: Stage[]
}

const roles: Record<RoleKey, { name: string; archetype: string; verbs: string[]; mission: string }> = {
  designer: {
    name: '游戏策划新人',
    archetype: '副本编织者',
    verbs: ['拆解玩法循环', '生成剧情分支', '验证体验假设'],
    mission: '把 AI 当成共同策划，从灵感扩散走向可验证的玩法方案。',
  },
  pm: {
    name: '产品 / 运营新人',
    archetype: '增长领航员',
    verbs: ['定义目标', '设计实验', '复盘数据'],
    mission: '用 AI 提升需求澄清、方案推演和跨团队协作效率。',
  },
  engineer: {
    name: '研发新人',
    archetype: '工具链锻造师',
    verbs: ['搭建工作流', '生成测试', '优化交付'],
    mission: '建立 AI 辅助编码、调试、文档和知识沉淀习惯。',
  },
  hr: {
    name: 'HR / 组织发展新人',
    archetype: '成长系统设计师',
    verbs: ['识别能力差距', '设计学习旅程', '沉淀组织知识'],
    mission: '把培训从制度宣讲升级为可追踪、可反馈、可共创的成长系统。',
  },
}

const levels: Record<LevelKey, { name: string; hint: string; modifier: string }> = {
  starter: {
    name: 'AI 新手',
    hint: '会用聊天工具，但缺少稳定方法论',
    modifier: '从提示词、边界意识和基础工具开始，避免一上来就堆复杂自动化。',
  },
  user: {
    name: 'AI 日常使用者',
    hint: '能完成生成、总结、翻译等任务',
    modifier: '重点训练复杂任务拆解、多轮校准和人机协同交付。',
  },
  builder: {
    name: 'AI 共创者',
    hint: '尝试过工作流、插件或智能体',
    modifier: '加入自动化、评估体系和跨角色共创机制。',
  },
}

const focuses: Record<FocusKey, { name: string; target: string }> = {
  pipeline: { name: '内容生产提效', target: '形成一套 AI 辅助内容/方案生产流水线' },
  tooling: { name: '工具链掌握', target: '完成个人 AI 工具栈和团队模板库' },
  culture: { name: 'AI Native 文化融入', target: '理解组织协作方式与安全边界' },
  delivery: { name: '业务项目交付', target: '围绕真实项目交付一个可验收成果' },
}

const roleOptions = Object.keys(roles) as RoleKey[]
const levelOptions = Object.keys(levels) as LevelKey[]
const focusOptions = Object.keys(focuses) as FocusKey[]
const stageKeys: StageKey[] = ['30', '60', '90']

function buildPlan(role: RoleKey, level: LevelKey, focus: FocusKey, seed: number): Plan {
  const roleMeta = roles[role]
  const levelMeta = levels[level]
  const focusMeta = focuses[focus]
  const questCode = `${role.slice(0, 2).toUpperCase()}-${focus.slice(0, 2).toUpperCase()}-${seed.toString().padStart(2, '0')}`

  return {
    roleName: roleMeta.name,
    archetype: roleMeta.archetype,
    narrative: `${roleMeta.mission}${levelMeta.modifier}本次副本代号 ${questCode}，最终目标是：${focusMeta.target}。`,
    powerUps: [
      '提示词拆解',
      '工作流搭建',
      '业务评估',
      '知识沉淀',
      role === 'engineer' ? '代码审查' : role === 'designer' ? '玩法验证' : role === 'pm' ? '数据复盘' : '组织诊断',
    ],
    stages: [
      makeStage('30', roleMeta, focusMeta, questCode),
      makeStage('60', roleMeta, focusMeta, questCode),
      makeStage('90', roleMeta, focusMeta, questCode),
    ],
  }
}

function makeStage(
  key: StageKey,
  roleMeta: { name: string; verbs: string[] },
  focusMeta: { name: string; target: string },
  questCode: string,
): Stage {
  const stageMeta = {
    '30': {
      title: 'Day 1-30',
      theme: '点亮基础技能树',
      roomName: '新手营地',
      goal: `理解 ${roleMeta.name} 在 AI Native 组织中的工作方式，建立工具栈、边界意识和第一次 AI 协作经验。`,
      checkpoint: '能独立完成一次结构化 AI 辅助任务，并解释每一步为什么这样做。',
      risk: '把 AI 当万能答案机，忽略业务上下文和验证动作。',
      taskType: ['破冰任务', '学习任务', '微型实战'],
      rewards: ['获得「提示词罗盘」', '获得「边界护符」', '获得「首个产出徽章」'],
    },
    '60': {
      title: 'Day 31-60',
      theme: '进入协作副本',
      roomName: '共创工坊',
      goal: `围绕 ${focusMeta.name} 建立一条可复用流程，让导师、同伴和业务方都能参与反馈。`,
      checkpoint: '能把任务拆成输入、处理、输出、评估四段，并形成 SOP。',
      risk: '工作流过度设计，流程看起来高级但业务收益不清晰。',
      taskType: ['协作任务', '小队评审', '能力复盘'],
      rewards: ['获得「流程蓝图」', '获得「协作印记」', '获得「雷达图碎片」'],
    },
    '90': {
      title: 'Day 61-90',
      theme: '挑战毕业 Boss',
      roomName: '交付圣殿',
      goal: `用 AI 共创方式交付一个可展示成果，证明自己能在真实项目中创造价值。`,
      checkpoint: '完成成果答辩，并把方法沉淀为下一批新人可复用资产。',
      risk: '只展示过程热闹，没有用指标或证据说明结果有效。',
      taskType: ['毕业任务', '沉淀任务', '答辩任务'],
      rewards: ['获得「共创作品」', '获得「组织资产」', '获得「独立作战许可」'],
    },
  }[key]

  const taskTitles = {
    '30': [
      `${roleMeta.verbs[0]}：完成一次 AI 协作基线任务`,
      'AI Native 工作方式入门',
      `${focusMeta.name} 微型练习`,
    ],
    '60': [
      `${roleMeta.verbs[1]}：把单点任务升级为工作流`,
      '跨角色共创评审',
      '建立个人能力雷达',
    ],
    '90': [
      `${roleMeta.verbs[2]}：交付一个 AI 共创作品`,
      '组织知识回流',
      '90 天成长答辩',
    ],
  }[key]

  const efforts = key === '30' ? ['2 天', '3 小时', '1 周'] : key === '60' ? ['1 周', '半天', '2 小时'] : ['2 周', '1 天', '半天']
  const tools = key === '30'
    ? ['ChatGPT / 腾讯元宝', '飞书文档 / Notion AI', 'Cursor / Coze / Dify']
    : key === '60'
      ? ['Dify / Coze', '飞书妙记 / 通义听悟', 'AI 表格']
      : ['组合工具栈', '知识库 Agent', '演示稿生成工具']

  return {
    key,
    title: stageMeta.title,
    theme: stageMeta.theme,
    roomName: stageMeta.roomName,
    goal: stageMeta.goal,
    checkpoint: stageMeta.checkpoint,
    risk: stageMeta.risk,
    tasks: taskTitles.map((title, index) => ({
      id: `${questCode}-${key}-${index}`,
      title,
      type: stageMeta.taskType[index],
      effort: efforts[index],
      output:
        index === 0
          ? '一页任务拆解卡 + 提示词版本记录'
          : index === 1
            ? '评审纪要 / 工具清单 / 知识库条目'
            : `${focusMeta.target} 的阶段性交付物`,
      mentor:
        index === 0
          ? '导师给出任务边界和优秀样例，不直接给答案'
          : index === 1
            ? '导师组织共创评审，帮助新人识别盲区'
            : '导师根据证据反馈，而不是凭感觉评价',
      aiTool: tools[index],
      reward: stageMeta.rewards[index],
    })),
  }
}

function App() {
  const [view, setView] = useState<ViewKey>('home')
  const [role, setRole] = useState<RoleKey>('designer')
  const [level, setLevel] = useState<LevelKey>('user')
  const [focus, setFocus] = useState<FocusKey>('pipeline')
  const [activeStage, setActiveStage] = useState<StageKey>('30')
  const [selectedTask, setSelectedTask] = useState(0)
  const [seed, setSeed] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const [toast, setToast] = useState('已载入默认成长副本，可进入生成器重新锻造。')
  const [mentorMode, setMentorMode] = useState(false)

  const plan = useMemo(() => buildPlan(role, level, focus, seed), [role, level, focus, seed])
  const stage = plan.stages.find((item) => item.key === activeStage) ?? plan.stages[0]
  const task = stage.tasks[selectedTask] ?? stage.tasks[0]
  const completion = Math.round((completedTasks.length / 9) * 100)
  const unlockedStageCount = completedTasks.length >= 6 ? 3 : completedTasks.length >= 3 ? 2 : 1

  function navigate(next: ViewKey) {
    setView(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function forgePlan() {
    setIsGenerating(true)
    setToast('正在锻造成长副本：解析岗位、匹配任务、生成通关条件...')
    window.setTimeout(() => {
      setSeed((value) => value + 1)
      setCompletedTasks([])
      setActiveStage('30')
      setSelectedTask(0)
      setIsGenerating(false)
      setToast('副本已生成：30 天新手营地已解锁，完成任务后继续开启 60/90 天章节。')
      navigate('map')
    }, 900)
  }

  function openStage(key: StageKey) {
    const index = stageKeys.indexOf(key)
    if (index + 1 > unlockedStageCount) {
      setToast('这一章还没解锁：先完成前置任务，副本会自动开放下一阶段。')
      return
    }
    setActiveStage(key)
    setSelectedTask(0)
    setToast(`${key} 天章节已进入：${plan.stages[index].roomName}`)
    navigate('room')
  }

  function toggleTask(taskId: string) {
    setCompletedTasks((current) => {
      const done = current.includes(taskId)
      const next = done ? current.filter((item) => item !== taskId) : [...current, taskId]
      setToast(done ? '任务已撤销完成，进度回退。' : `${task.reward} 已入库，成长进度更新。`)
      return next
    })
  }

  return (
    <main className="app">
      <header className="nav">
        <button className="brand" type="button" onClick={() => navigate('home')}>
          <span className="brand-mark">副</span>
          <span>
            <strong>成长副本</strong>
            <small>30-60-90 Learning Quest</small>
          </span>
        </button>
        <nav>
          {[
            ['home', '封面'],
            ['forge', '生成器'],
            ['map', '副本地图'],
            ['room', '任务房间'],
            ['mentor', '导师看板'],
          ].map(([key, label]) => (
            <button className={view === key ? 'active' : ''} type="button" key={key} onClick={() => navigate(key as ViewKey)}>
              {label}
            </button>
          ))}
        </nav>
        <button className="ghost-button" type="button" onClick={() => setMentorMode((value) => !value)}>
          {mentorMode ? '新人视角' : '导师视角'}
        </button>
      </header>

      <div className="toast" role="status">{toast}</div>

      {view === 'home' && (
        <section className="home-screen">
          <div className="cover-card">
            <div className="cover-copy">
              <span className="chapter-line">AI Native Onboarding Quest</span>
              <h1>成长不是培训表，是一张会解锁的副本地图。</h1>
              <p>
                为 AI Native 游戏组织的新员工生成 30/60/90 天成长路径：从新手营地、共创工坊到交付圣殿，
                每一章都有任务、导师动作、AI 工具和通关奖励。
              </p>
              <div className="hero-actions">
                <button className="primary-button" type="button" onClick={() => navigate('forge')}>进入副本生成器</button>
                <button className="secondary-button" type="button" onClick={() => navigate('map')}>查看已生成地图</button>
              </div>
            </div>
            <div className="quest-art" aria-hidden="true">
              <div className="floating-card one">30 天 · 新手营地</div>
              <div className="floating-card two">60 天 · 共创工坊</div>
              <div className="floating-card three">90 天 · 交付圣殿</div>
              <div className="portal">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
          <div className="cover-strip">
            {['生成路径', '解锁章节', '进入任务房间', '导师验收'].map((item, index) => (
              <button type="button" key={item} onClick={() => navigate(index === 0 ? 'forge' : index === 1 ? 'map' : index === 2 ? 'room' : 'mentor')}>
                <span>0{index + 1}</span>
                <strong>{item}</strong>
              </button>
            ))}
          </div>
        </section>
      )}

      {view === 'forge' && (
        <section className="page-grid forge-screen">
          <div className="page-intro">
            <span className="chapter-line">Forge Your Quest</span>
            <h2>先设定新人角色，再锻造一条 90 天成长副本。</h2>
            <p>{plan.narrative}</p>
            <div className={isGenerating ? 'forge-core loading' : 'forge-core'}>
              <span>{isGenerating ? '生成中' : plan.archetype}</span>
            </div>
          </div>
          <div className="config-board">
            <ChoiceGroup title="新人角色" options={roleOptions} value={role} onChange={setRole} getTitle={(item) => roles[item].name} getDesc={(item) => roles[item].archetype} />
            <ChoiceGroup title="AI 基础" options={levelOptions} value={level} onChange={setLevel} getTitle={(item) => levels[item].name} getDesc={(item) => levels[item].hint} />
            <ChoiceGroup title="核心目标" options={focusOptions} value={focus} onChange={setFocus} getTitle={(item) => focuses[item].name} getDesc={(item) => focuses[item].target} />
            <button className="primary-button full" type="button" onClick={forgePlan} disabled={isGenerating}>
              {isGenerating ? '正在生成副本...' : '生成我的 30/60/90 天成长副本'}
            </button>
          </div>
        </section>
      )}

      {view === 'map' && (
        <section className="map-screen">
          <div className="page-intro wide">
            <span className="chapter-line">Quest Map</span>
            <h2>{plan.roleName} · {plan.archetype}</h2>
            <p>{plan.narrative}</p>
          </div>
          <div className="map-route">
            {plan.stages.map((item, index) => {
              const locked = index + 1 > unlockedStageCount
              const doneCount = item.tasks.filter((current) => completedTasks.includes(current.id)).length
              return (
                <button className={locked ? 'map-node locked' : 'map-node'} type="button" key={item.key} onClick={() => openStage(item.key)}>
                  <span>{item.title}</span>
                  <strong>{item.roomName}</strong>
                  <small>{item.theme}</small>
                  <i>{locked ? '未解锁' : `${doneCount}/3 任务`}</i>
                </button>
              )
            })}
          </div>
          <div className="map-legend">
            <strong>解锁规则</strong>
            <p>完成 3 个任务解锁 60 天章节，完成 6 个任务解锁 90 天章节。打卡不是普通 checkbox，而是副本通关证据。</p>
          </div>
        </section>
      )}

      {view === 'room' && (
        <section className="room-screen">
          <div className="room-stage">
            <span className="chapter-line">{stage.title} · {stage.roomName}</span>
            <h2>{stage.theme}</h2>
            <p>{stage.goal}</p>
            <div className="room-meta">
              <div><strong>通关条件</strong><span>{stage.checkpoint}</span></div>
              <div><strong>Boss 风险</strong><span>{stage.risk}</span></div>
            </div>
            <div className="room-tabs">
              {plan.stages.map((item) => (
                <button className={activeStage === item.key ? 'active' : ''} type="button" key={item.key} onClick={() => openStage(item.key)}>
                  {item.key} 天
                </button>
              ))}
            </div>
          </div>
          <div className="task-dungeon">
            <div className="task-deck">
              {stage.tasks.map((item, index) => (
                <button className={selectedTask === index ? 'task-card active' : 'task-card'} type="button" key={item.id} onClick={() => setSelectedTask(index)}>
                  <span>{item.type}</span>
                  <strong>{item.title}</strong>
                  <small>{completedTasks.includes(item.id) ? item.reward : item.effort}</small>
                </button>
              ))}
            </div>
            <aside className="task-panel">
              <div className="panel-head">
                <span>任务房间</span>
                <button type="button" onClick={() => toggleTask(task.id)}>
                  {completedTasks.includes(task.id) ? '撤销打卡' : '通关打卡'}
                </button>
              </div>
              <h3>{task.title}</h3>
              <div className="detail-grid">
                <div><label>预计投入</label><strong>{task.effort}</strong></div>
                <div><label>AI 工具</label><strong>{task.aiTool}</strong></div>
                <div><label>交付物</label><strong>{task.output}</strong></div>
                <div><label>{mentorMode ? '导师动作' : '求助姿势'}</label><strong>{task.mentor}</strong></div>
              </div>
              <div className="prompt-box">
                <span>Prompt Starter</span>
                <p>我是一名{roles[role].name}，当前处在 {stage.title}。请帮我把“{task.title}”拆成目标、输入材料、执行步骤、质量标准和风险提醒，并输出一份可交付清单。</p>
              </div>
            </aside>
          </div>
        </section>
      )}

      {view === 'mentor' && (
        <section className="mentor-screen">
          <div className="score-card">
            <span>成长进度</span>
            <strong>{completion}%</strong>
            <div className="progress-track"><i style={{ width: `${completion}%` }} /></div>
            <p>已完成 {completedTasks.length}/9 个关键任务。HR 能追踪适应情况，导师能看到下一次辅导重点。</p>
          </div>
          <div className="board-card">
            <span>导师带教节奏</span>
            <h3>{mentorMode ? '导师视角：关注证据，不凭感觉评价。' : '新人视角：每周知道该拿什么找导师。'}</h3>
            <ul>
              <li>第 1 周：确认岗位目标、工具权限、安全边界。</li>
              <li>第 4 周：检查第一次 AI 协作任务，反馈提示词与验证方式。</li>
              <li>第 8 周：评审工作流 SOP，判断是否可复用给团队。</li>
              <li>第 12 周：组织 90 天答辩，确认独立承担任务能力。</li>
            </ul>
          </div>
          <div className="board-card accent">
            <span>效果评估</span>
            <h3>四个指标看 Demo 是否有效</h3>
            <ul>
              <li>新人清晰度：知道每 30 天该完成什么。</li>
              <li>导师协同度：带教动作被标准化，而不是全靠经验。</li>
              <li>业务价值：最终交付真实项目成果或团队资产。</li>
              <li>组织沉淀：提示词、SOP、案例进入知识库。</li>
            </ul>
          </div>
        </section>
      )}
    </main>
  )
}

function ChoiceGroup<T extends string>({
  title,
  options,
  value,
  onChange,
  getTitle,
  getDesc,
}: {
  title: string
  options: T[]
  value: T
  onChange: (value: T) => void
  getTitle: (value: T) => string
  getDesc: (value: T) => string
}) {
  return (
    <div className="choice-group">
      <label>{title}</label>
      <div className="choice-grid">
        {options.map((item) => (
          <button className={value === item ? 'choice-card active' : 'choice-card'} type="button" key={item} onClick={() => onChange(item)}>
            <strong>{getTitle(item)}</strong>
            <span>{getDesc(item)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default App
