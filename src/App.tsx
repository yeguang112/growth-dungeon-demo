import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import './App.css'
import BubbleMenu from './components/BubbleMenu'
import DecryptedText from './components/DecryptedText'
import GradualBlur from './components/GradualBlur'
import MagnetLines from './components/MagnetLines'
import PillNav from './components/PillNav'
import ScrollFloat from './components/ScrollFloat'
import ShinyText from './components/ShinyText'
import SpotlightSurface from './components/SpotlightSurface'
import TargetCursor from './components/TargetCursor'
import Waves from './components/Waves'

type RoleKey = 'designer' | 'pm' | 'engineer' | 'hr'
type LevelKey = 'starter' | 'user' | 'builder'
type FocusKey = 'pipeline' | 'tooling' | 'culture' | 'delivery'
type StageKey = '30' | '60' | '90'
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
  roomName: string
  theme: string
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
    mission: '从灵感、规则、体验验证三条线进入 AI 共创，不让创意停在脑暴里。',
  },
  pm: {
    name: '产品 / 运营新人',
    archetype: '增长领航员',
    verbs: ['定义目标', '设计实验', '复盘数据'],
    mission: '把 AI 用在需求澄清、方案推演和跨团队协作上，让每次讨论都能留下证据。',
  },
  engineer: {
    name: '研发新人',
    archetype: '工具链锻造师',
    verbs: ['搭建工作流', '生成测试', '优化交付'],
    mission: '建立 AI 辅助编码、调试、文档和知识沉淀习惯，减少重复劳动。',
  },
  hr: {
    name: 'HR / 组织发展新人',
    archetype: '成长系统设计师',
    verbs: ['识别能力差距', '设计学习旅程', '沉淀组织知识'],
    mission: '把培训从制度宣讲升级为可追踪、可反馈、可复制的成长系统。',
  },
}

const levels: Record<LevelKey, { name: string; hint: string; modifier: string }> = {
  starter: {
    name: 'AI 新手',
    hint: '会用聊天工具，但没有稳定方法',
    modifier: '优先建立提示词结构、边界意识和基础工具习惯。',
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
const pageFlow: { key: ViewKey; label: string; eyebrow: string }[] = [
  { key: 'home', label: '导览', eyebrow: 'START' },
  { key: 'forge', label: '设定', eyebrow: 'PROFILE' },
  { key: 'map', label: '路径', eyebrow: 'ROADMAP' },
  { key: 'room', label: '任务', eyebrow: 'QUEST' },
  { key: 'mentor', label: '复盘', eyebrow: 'REVIEW' },
]
const viewKeys = pageFlow.map((item) => item.key)
const bubbleItems = [
  { href: '#forge', label: '设定画像', hint: '选择岗位、AI 基础与目标', rotation: -7, color: '#f5d17a' },
  { href: '#map', label: '看路径', hint: '查看 30 / 60 / 90 三阶段', rotation: 5, color: '#b7f4df' },
  { href: '#room', label: '打卡任务', hint: '完成任务解锁下一章', rotation: -3, color: '#ffdfb0' },
  { href: '#mentor', label: '导师复盘', hint: '按证据反馈成长节奏', rotation: 6, color: '#d7c5ff' },
]

function getViewFromHash(): ViewKey {
  const key = window.location.hash.replace('#', '') as ViewKey
  return viewKeys.includes(key) ? key : 'home'
}

function buildPlan(role: RoleKey, level: LevelKey, focus: FocusKey, seed: number): Plan {
  const roleMeta = roles[role]
  const levelMeta = levels[level]
  const focusMeta = focuses[focus]
  const questCode = `${role.slice(0, 2).toUpperCase()}-${focus.slice(0, 2).toUpperCase()}-${seed.toString().padStart(2, '0')}`

  return {
    roleName: roleMeta.name,
    archetype: roleMeta.archetype,
    narrative: `${roleMeta.mission}${levelMeta.modifier}本次副本代号 ${questCode}，终局目标：${focusMeta.target}。`,
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
      roomName: '新手营地',
      theme: '点亮基础技能树',
      goal: `理解 ${roleMeta.name} 在 AI Native 组织中的工作方式，建立工具栈、边界意识和第一次 AI 协作经验。`,
      checkpoint: '能独立完成一次结构化 AI 辅助任务，并解释每一步为什么这样做。',
      risk: '把 AI 当万能答案机，忽略业务上下文和验证动作。',
      taskType: ['破冰任务', '学习任务', '微型实战'],
      rewards: ['提示词罗盘', '边界护符', '首个产出徽章'],
    },
    '60': {
      title: 'Day 31-60',
      roomName: '共创工坊',
      theme: '进入协作副本',
      goal: `围绕 ${focusMeta.name} 建立一条可复用流程，让导师、同伴和业务方都能参与反馈。`,
      checkpoint: '能把任务拆成输入、处理、输出、评估四段，并形成 SOP。',
      risk: '工作流过度设计，流程看起来高级但业务收益不清晰。',
      taskType: ['协作任务', '小队评审', '能力复盘'],
      rewards: ['流程蓝图', '协作印记', '雷达图碎片'],
    },
    '90': {
      title: 'Day 61-90',
      roomName: '交付圣殿',
      theme: '挑战毕业 Boss',
      goal: `用 AI 共创方式交付一个可展示成果，证明自己能在真实项目中创造价值。`,
      checkpoint: '完成成果答辩，并把方法沉淀为下一批新人可复用资产。',
      risk: '只展示过程热闹，没有用指标或证据说明结果有效。',
      taskType: ['毕业任务', '沉淀任务', '答辩任务'],
      rewards: ['共创作品', '组织资产', '独立作战许可'],
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
    roomName: stageMeta.roomName,
    theme: stageMeta.theme,
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
          ? '导师给出任务边界和优秀样例，不直接给答案。'
          : index === 1
            ? '导师组织共创评审，帮助新人识别盲区。'
            : '导师根据证据反馈，而不是凭感觉评价。',
      aiTool: tools[index],
      reward: stageMeta.rewards[index],
    })),
  }
}

export default function App() {
  const [view, setView] = useState<ViewKey>(() => getViewFromHash())
  const [role, setRole] = useState<RoleKey>('designer')
  const [level, setLevel] = useState<LevelKey>('user')
  const [focus, setFocus] = useState<FocusKey>('pipeline')
  const [activeStage, setActiveStage] = useState<StageKey>('30')
  const [selectedTask, setSelectedTask] = useState(0)
  const [seed, setSeed] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const [mentorMode, setMentorMode] = useState(false)
  const [toast, setToast] = useState('欢迎进入成长副本：先设定新人画像，再生成 30/60/90 天路径。')

  const plan = useMemo(() => buildPlan(role, level, focus, seed), [focus, level, role, seed])
  const activeStageData = plan.stages.find((item) => item.key === activeStage) ?? plan.stages[0]
  const activeTask = activeStageData.tasks[selectedTask] ?? activeStageData.tasks[0]
  const completion = Math.round((completedTasks.length / 9) * 100)
  const unlockedStageCount = completedTasks.length >= 6 ? 3 : completedTasks.length >= 3 ? 2 : 1
  const pageIndex = pageFlow.findIndex((item) => item.key === view)

  useEffect(() => {
    const syncView = () => setView(getViewFromHash())
    window.addEventListener('hashchange', syncView)
    window.addEventListener('popstate', syncView)
    return () => {
      window.removeEventListener('hashchange', syncView)
      window.removeEventListener('popstate', syncView)
    }
  }, [])

  function navigate(next: ViewKey) {
    const nextHash = `#${next}`
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, '', nextHash)
    }
    setView(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function navigateHref(href: string) {
    const next = href.replace('#', '') as ViewKey
    if (viewKeys.includes(next)) navigate(next)
  }

  function goPage(direction: 1 | -1) {
    const nextIndex = Math.min(pageFlow.length - 1, Math.max(0, pageIndex + direction))
    navigate(pageFlow[nextIndex].key)
  }

  function forgePlan() {
    setIsGenerating(true)
    setToast('正在生成副本：角色目标、AI 工具、通关证据正在组装...')
    window.setTimeout(() => {
      setSeed((value) => value + 1)
      setCompletedTasks([])
      setActiveStage('30')
      setSelectedTask(0)
      setIsGenerating(false)
      setToast('副本已生成。先从 Day 1-30 开始，完成 3 个任务后解锁下一章。')
      navigate('map')
    }, 720)
  }

  function openStage(key: StageKey) {
    const index = stageKeys.indexOf(key)
    if (index + 1 > unlockedStageCount) {
      setToast('这一章还没开放：完成前置章节的 3 个任务后会自动解锁。')
      return
    }

    setActiveStage(key)
    setSelectedTask(0)
    setToast(`${plan.stages[index].roomName} 已进入：选择一个任务开始打卡。`)
    navigate('room')
  }

  function toggleTask(taskId: string) {
    setCompletedTasks((current) => {
      const isDone = current.includes(taskId)
      const next = isDone ? current.filter((item) => item !== taskId) : [...current, taskId]
      setToast(isDone ? '已撤销打卡，成长进度同步回退。' : `获得「${activeTask.reward}」，成长进度已更新。`)
      return next
    })
  }

  return (
    <main className="app">
      <TargetCursor />
      <div className="ambient-waves">
        <Waves
          lineColor="rgba(255, 240, 210, 0.16)"
          backgroundColor="transparent"
          waveSpeedX={0.028}
          waveSpeedY={0.009}
          waveAmpX={38}
          waveAmpY={20}
          friction={0.91}
          tension={0.008}
          maxCursorMove={118}
          xGap={14}
          yGap={38}
        />
      </div>
      <div className="grain" aria-hidden="true" />
      <MagnetLines className="hero-magnet" rows={7} columns={7} containerSize="min(42vw, 440px)" lineColor="rgba(255, 220, 145, 0.28)" lineWidth="2px" lineHeight="34px" />
      <GradualBlur />

      <PillNav
        activeHref={`#${view}`}
        items={pageFlow.map((item) => ({ href: `#${item.key}`, label: item.label, eyebrow: item.eyebrow }))}
        onNavigate={navigateHref}
      />
      <BubbleMenu items={bubbleItems} onNavigate={navigateHref} />

      <button className="mentor-switch" type="button" onClick={() => setMentorMode((value) => !value)}>
        {mentorMode ? '导师视角' : '新人视角'}
      </button>

      <PagePager pageIndex={pageIndex} onPrev={() => goPage(-1)} onNext={() => goPage(1)} />
      <div className="toast" role="status">{toast}</div>

      {view === 'home' && (
        <PageFrame eyebrow="Learning Quest Designer" page="01 / 05">
          <section className="hero-page">
            <div className="hero-copy">
              <span className="kicker"><ShinyText text="AI Native Onboarding" /></span>
              <ScrollFloat text="三个月，不是培训表，是一条成长副本。" />
              <p>
                面向游戏行业 AI Native 组织的新员工，把「制度宣讲 + 业务介绍」改造成可生成、可解锁、可复盘的 30/60/90 天成长路径。
              </p>
              <div className="hero-actions">
                <button className="primary-action" type="button" onClick={() => navigate('forge')}>开始生成路径</button>
                <button className="ghost-action" type="button" onClick={() => navigate('mentor')}>查看导师协同</button>
              </div>
            </div>
            <SpotlightSurface className="intro-rail">
              {[
                ['01', '画像设定', '选择新人岗位、AI 基础和业务目标。'],
                ['02', '路径生成', '输出 30/60/90 三阶段任务与证据。'],
                ['03', '打卡复盘', '完成任务解锁章节，导师按证据反馈。'],
              ].map(([index, title, desc]) => (
                <button className="rail-step" type="button" key={index} onClick={() => navigate(index === '01' ? 'forge' : index === '02' ? 'map' : 'room')}>
                  <span>{index}</span>
                  <strong>{title}</strong>
                  <small>{desc}</small>
                </button>
              ))}
            </SpotlightSurface>
          </section>
        </PageFrame>
      )}

      {view === 'forge' && (
        <PageFrame eyebrow="Profile Setup" page="02 / 05">
          <section className="forge-page">
            <div className="page-intro">
              <span className="kicker"><ShinyText text="Path Input" /></span>
              <ScrollFloat text="先确认新人画像，再让路径自己长出来。" as="h2" className="compact" />
              <p>{plan.narrative}</p>
              <div className={`forge-status${isGenerating ? ' is-loading' : ''}`}>
                <i />
                <DecryptedText
                  key={isGenerating ? 'generating' : plan.archetype}
                  text={isGenerating ? '正在铸造副本' : plan.archetype}
                  animateOn="view"
                  revealDirection="center"
                  encryptedClassName="encrypted"
                />
              </div>
            </div>

            <SpotlightSurface as="form" className="setup-form" onSubmit={(event) => { event.preventDefault(); forgePlan() }}>
              <ChoiceRows title="新人角色" options={roleOptions} value={role} onChange={setRole} getTitle={(item) => roles[item].name} getDesc={(item) => roles[item].archetype} />
              <ChoiceRows title="AI 基础" options={levelOptions} value={level} onChange={setLevel} getTitle={(item) => levels[item].name} getDesc={(item) => levels[item].hint} />
              <ChoiceRows title="核心目标" options={focusOptions} value={focus} onChange={setFocus} getTitle={(item) => focuses[item].name} getDesc={(item) => focuses[item].target} />
              <button className="primary-action full" type="submit" disabled={isGenerating}>
                {isGenerating ? '正在生成...' : '生成我的 30/60/90 天成长副本'}
              </button>
            </SpotlightSurface>
          </section>
        </PageFrame>
      )}

      {view === 'map' && (
        <PageFrame eyebrow="Generated Roadmap" page="03 / 05">
          <section className="map-page">
            <div className="map-head">
              <div>
                <span className="kicker"><ShinyText text="Quest Map" /></span>
                <ScrollFloat text={`${plan.roleName} · ${plan.archetype}`} as="h2" className="compact" />
                <p>{plan.narrative}</p>
              </div>
              <PowerList items={plan.powerUps} />
            </div>

            <ol className="chapter-strip">
              {plan.stages.map((item, index) => {
                const locked = index + 1 > unlockedStageCount
                const doneCount = item.tasks.filter((task) => completedTasks.includes(task.id)).length
                return (
                  <li className={locked ? 'is-locked' : ''} key={item.key}>
                    <button type="button" onClick={() => openStage(item.key)}>
                      <span>{item.title}</span>
                      <strong>{item.roomName}</strong>
                      <em>{item.theme}</em>
                      <small>{locked ? '未解锁' : `${doneCount}/3 已完成`}</small>
                    </button>
                  </li>
                )
              })}
            </ol>
            <p className="unlock-rule">解锁规则：完成 3 个任务开放 60 天章节，完成 6 个任务开放 90 天章节。</p>
          </section>
        </PageFrame>
      )}

      {view === 'room' && (
        <PageFrame eyebrow={`${activeStageData.title} / ${activeStageData.roomName}`} page="04 / 05">
          <section className="room-page">
            <div className="room-head">
              <div>
                <span className="kicker"><ShinyText text="Active Quest" /></span>
                <ScrollFloat text={activeStageData.theme} as="h2" className="compact" />
                <p>{activeStageData.goal}</p>
              </div>
              <div className="stage-tabs" aria-label="章节切换">
                {plan.stages.map((item) => (
                  <button className={activeStage === item.key ? 'active' : ''} type="button" key={item.key} onClick={() => openStage(item.key)}>
                    {item.key} 天
                  </button>
                ))}
              </div>
            </div>

            <SpotlightSurface className="mission-board">
              <nav className="mission-list" aria-label="任务列表">
                {activeStageData.tasks.map((item, index) => (
                  <button className={selectedTask === index ? 'active' : ''} type="button" key={item.id} onClick={() => setSelectedTask(index)}>
                    <span>{item.type}</span>
                    <strong>{item.title}</strong>
                    <small>{completedTasks.includes(item.id) ? `已获得：${item.reward}` : item.effort}</small>
                  </button>
                ))}
              </nav>

              <article className="mission-detail">
                <div className="detail-actions">
                  <span>任务详情</span>
                  <button type="button" onClick={() => toggleTask(activeTask.id)}>
                    {completedTasks.includes(activeTask.id) ? '撤销打卡' : '完成打卡'}
                  </button>
                </div>
                <h3>{activeTask.title}</h3>
                <DescriptionGrid
                  items={[
                    ['预计投入', activeTask.effort],
                    ['AI 工具', activeTask.aiTool],
                    ['交付物', activeTask.output],
                    [mentorMode ? '导师动作' : '求助姿势', activeTask.mentor],
                  ]}
                />
                <div className="prompt-block">
                  <span>Prompt Starter</span>
                  <p>
                    我是一名{roles[role].name}，当前处在 {activeStageData.title}。请帮我把“{activeTask.title}”拆成目标、输入材料、执行步骤、质量标准和风险提醒，并输出一份可交付清单。
                  </p>
                </div>
              </article>
            </SpotlightSurface>
          </section>
        </PageFrame>
      )}

      {view === 'mentor' && (
        <PageFrame eyebrow="Mentor Review" page="05 / 05">
          <section className="review-page">
            <div className="progress-column">
              <span className="kicker"><ShinyText text="Progress Evidence" /></span>
              <strong>{completion}%</strong>
              <div className="progress-track"><i style={{ width: `${completion}%` }} /></div>
              <p>已完成 {completedTasks.length}/9 个关键任务。HR 看整体适应节奏，导师看下一步辅导动作。</p>
              <button className="ghost-action" type="button" onClick={() => navigate('room')}>回到任务打卡</button>
            </div>
            <div className="review-copy">
              <ScrollFloat text={mentorMode ? '导师看证据，不凭感觉评价。' : '新人每周知道拿什么找导师。'} as="h2" className="compact" />
              <ul className="ritual-list">
                <li><span>Week 1</span><strong>确认岗位目标、工具权限、安全边界。</strong></li>
                <li><span>Week 4</span><strong>检查第一次 AI 协作任务，反馈提示词与验证方式。</strong></li>
                <li><span>Week 8</span><strong>评审工作流 SOP，判断是否可复用给团队。</strong></li>
                <li><span>Week 12</span><strong>组织 90 天答辩，确认独立承担任务能力。</strong></li>
              </ul>
            </div>
          </section>
        </PageFrame>
      )}
    </main>
  )
}

function PageFrame({ eyebrow, page, children }: { eyebrow: string; page: string; children: ReactNode }) {
  return (
    <section className="page-frame">
      <div className="page-meta">
        <span>
          <DecryptedText text={eyebrow} sequential={false} animateOn="view" encryptedClassName="encrypted" />
        </span>
        <strong><ShinyText text={page} speed={3.4} /></strong>
      </div>
      {children}
    </section>
  )
}

function PagePager({ pageIndex, onPrev, onNext }: { pageIndex: number; onPrev: () => void; onNext: () => void }) {
  return (
    <div className="page-pager">
      <button type="button" onClick={onPrev} disabled={pageIndex === 0}>上一页</button>
      <span>{String(pageIndex + 1).padStart(2, '0')} / {String(pageFlow.length).padStart(2, '0')}</span>
      <button type="button" onClick={onNext} disabled={pageIndex === pageFlow.length - 1}>下一页</button>
    </div>
  )
}

function ChoiceRows<T extends string>({
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
    <fieldset className="choice-rows">
      <legend>{title}</legend>
      <div>
        {options.map((item, index) => (
          <button className={value === item ? 'active' : ''} type="button" key={item} onClick={() => onChange(item)}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{getTitle(item)}</strong>
            <small>{getDesc(item)}</small>
          </button>
        ))}
      </div>
    </fieldset>
  )
}

function PowerList({ items }: { items: string[] }) {
  return (
    <div className="power-list" aria-label="能力模块">
      {items.map((item) => (
        <span key={item}><ShinyText text={item} speed={4.2} shineColor="#ffffff" /></span>
      ))}
    </div>
  )
}

function DescriptionGrid({ items }: { items: [string, string][] }) {
  return (
    <dl className="description-grid">
      {items.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  )
}
