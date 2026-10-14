import type {Project} from './content.js';
import type {CaseStudy} from './case-types.js';
import type {ProjectLink, ProjectMedia} from './project-types.js';

export const shixuProject: Project = {
 id: 'shixu', name: '拾序 · Shixu', short: '拾', kind: 'ai',
 stack: ['WinUI 3', 'Windows', 'Web', 'Encrypted sync'],
 url: 'https://fairyllm.com/shixu/',
 en: {
  category: 'PERSONAL WORK & PLANNING',
  summary: 'Tasks, schedules, notes and focus in one personal workspace, with a Windows app and a live web workbench.',
  role: 'Independent product development: workspace design, Windows and web experiences, assistant proposals and encrypted account sync.',
  status: 'Available on Windows and the web',
  evidence: 'The public product site provides the web workbench, stable Windows download page and product screenshots used in this case.',
  limits: 'Independent desktop widgets belong to the Windows app. The web assistant uses local rules; desktop cloud models are not advertised as a web capability. The desktop source is private.',
  features: ['Tasks, schedules, notes, calendar and focus.', 'Independent Windows desktop widgets.', 'Assistant proposals reviewed before changes.', 'Encrypted sync between signed-in devices.'],
  challenge: 'Keep plans easy to reach while preserving the distinction between a suggestion and a confirmed change.'
 },
 zh: {
  category: '个人办公事项工作台',
  summary: '把待办、日程、便签与专注放在一处，连接 Windows 桌面与可直接使用的网页工作台。',
  role: '独立产品开发：事项工作台设计、Windows 与网页体验、助手提案和账户加密同步。',
  status: 'Windows 与网页版已开放',
  evidence: '公开官网提供网页工作台、稳定 Windows 下载页和本案例使用的产品截图。',
  limits: '独立桌面组件属于 Windows 原生功能。网页助手目前使用本地规则，桌面云模型不作为网页能力宣传。桌面源码为私有。',
  features: ['待办、日程、便签、日历与专注。', 'Windows 独立桌面组件。', '助手更改先生成提案，再由用户确认。', '登录账户后在设备间加密同步。'],
  challenge: '让事项随手可达，同时明确区分助手的建议与用户确认后的更改。'
 }
};

export const shixuCases: Record<string, {en: CaseStudy; zh: CaseStudy}> = {
 shixu: {
  en: {
   tagline: 'Gather the small things. Give your day a place.',
   purpose: 'Shixu brings tasks, schedules, notes, a calendar and focus into a personal workbench. The web workspace is available in the browser; the Windows app adds native desktop components.',
   audience: 'People managing their own work, study and everyday plans across a browser and a Windows desktop.',
   scenario: 'Capture a task, reserve time for it, and review an assistant proposal before changing the plan.',
   workflowNote: 'This sequence illustrates a typical workflow. Product screenshots and the embedded web workbench are available separately; Windows-only features are labelled.',
   workflow: [
    {title: 'Capture', body: 'Put a task, event or note into the workbench without switching tools.'},
    {title: 'Plan', body: 'Use the calendar to organise time and check possible conflicts.'},
    {title: 'Review', body: 'Inspect assistant suggestions; proposed changes wait for your confirmation.'},
    {title: 'Keep it close', body: 'Open the web workspace anywhere, or use independent widgets in the Windows app.'}
   ],
   capabilities: [
    {title: 'A daily workspace', body: 'Tasks, schedules, notes, calendar views and focus sessions share one place.'},
    {title: 'Windows desktop widgets', body: 'Drag independent components onto the Windows desktop. The web view shows a component layout, not system-level desktop windows.'},
    {title: 'A proposal-first assistant', body: 'Task breakdown, scheduling and conflict checks lead to proposals. The web assistant uses local rules; desktop cloud models are configured in Windows.'},
    {title: 'Encrypted account sync', body: 'Signed-in devices can synchronise encrypted workspace data through the shared account.'}
   ],
   development: 'The project spans a native Windows interface and a browser workbench. This portfolio reuses its published assets and live web routes, and directs desktop visitors to a stable download page.',
   decisions: [
    {title: 'Confirm changes', body: 'Assistant suggestions do not silently replace the user’s plan.'},
    {title: 'Respect platform boundaries', body: 'Native Windows widgets and configured cloud models stay distinct from the browser experience.'},
    {title: 'Keep downloads stable', body: 'The download page resolves the current Windows release, so this portfolio carries no version-specific package link.'}
   ],
   relationship: 'Shixu is part of the Fairy series, focused on personal work and planning. The public site, web workspace and download page are the visitor-facing entry points.',
   terms: [
    {title: 'WinUI 3', body: 'The native interface framework used by the Windows application.'},
    {title: 'Proposal', body: 'A suggested change that the user reviews before it is applied.'},
    {title: 'Encrypted sync', body: 'Account-based synchronisation that transfers encrypted workspace data between devices.'}
   ]
  },
  zh: {
   tagline: '拾起琐事，排好一天。',
   purpose: '拾序把待办、日程、便签、日历与专注汇聚成个人办公事项工作台。网页可在浏览器直接使用，Windows 端进一步提供原生桌面组件。',
   audience: '需要在浏览器与 Windows 桌面之间管理工作、学习和日常安排的个人用户。',
   scenario: '记下一件待办，安排一段时间，再核对助手提案，由自己决定是否更改计划。',
   workflowNote: '这里是典型使用流程的示意；产品截图与内嵌网页工作台单独展示，Windows 专属功能有明确标注。',
   workflow: [
    {title: '随手记下', body: '把待办、事件或便签放进工作台，不必切换多个工具。'},
    {title: '安排时间', body: '通过日历整理计划，检查安排之间可能存在的冲突。'},
    {title: '核对提案', body: '查看助手的拆解与排期建议，更改需经过你的确认。'},
    {title: '留在手边', body: '网页中继续处理事项，Windows 端可把独立组件放到桌面。'}
   ],
   capabilities: [
    {title: '一天的事项，一处安放', body: '待办、日程、便签、日历视图与专注会话共享一个工作台。'},
    {title: 'Windows 桌面组件', body: '独立组件可拖到 Windows 桌面。网页展示的是组件排布，不是系统级桌面窗口。'},
    {title: '先提案，再更改', body: '助手支持待办拆解、日程安排与冲突检查；网页使用本地规则，桌面云模型在 Windows 端配置。'},
    {title: '账户加密同步', body: '登录同一账户的设备可通过账户服务同步加密的工作台数据。'}
   ],
   development: '产品连接 Windows 原生界面和网页工作台。作品集复用已公开的真实素材与网页入口，桌面下载始终指向稳定下载页。',
   decisions: [
    {title: '更改由用户确认', body: '助手的建议不会直接覆盖用户的安排。'},
    {title: '按平台说明能力', body: 'Windows 原生组件与可配置的云模型，同浏览器的规则助手分别说明。'},
    {title: '保持下载入口稳定', body: '由下载页提供当前 Windows 发布版，作品集不绑定某个版本安装包。'}
   ],
   relationship: '拾序属于 Fairy 系列，专注个人办公与事项安排。官网、网页工作台和下载页构成公开入口。',
   terms: [
    {title: 'WinUI 3', body: 'Windows 应用使用的原生界面框架。'},
    {title: '提案', body: '助手生成的建议更改，经过用户核对与确认后才应用。'},
    {title: '加密同步', body: '通过账户服务在设备之间传输加密的工作台数据。'}
   ]
  }
 }
};

export const shixuLinks: ProjectLink[] = [
 {kind: 'website', url: './shixu/', label: {en: 'Product site', zh: '拾序官网'}, access: 'public', verification: 'verified', verifiedAt: '2026-10-15', publication: 'approved'},
 {kind: 'demo', url: './shixu/workbench/', label: {en: 'Open web workbench', zh: '打开网页工作台'}, access: 'public', verification: 'verified', verifiedAt: '2026-10-15', publication: 'approved'},
 {kind: 'download', url: './shixu/download/', label: {en: 'Download for Windows', zh: '下载 Windows 桌面端'}, access: 'public', verification: 'verified', verifiedAt: '2026-10-15', publication: 'approved'}
];

export const shixuMedia: ProjectMedia[] = [
 {id: 'shixu-today', projectId: 'shixu', type: 'screenshot', src: './shixu/assets/today.jpg', width: 1425, height: 990,
  alt: {en: 'Shixu daily workspace with example tasks and notes', zh: '拾序今日工作台，展示示例待办和便签'},
  caption: {en: 'Daily workspace with example items', zh: '今日工作台 · 示例事项'}, claimIds: ['daily-workspace']},
 {id: 'shixu-calendar', projectId: 'shixu', type: 'screenshot', src: './shixu/assets/calendar.jpg', width: 1425, height: 990,
  alt: {en: 'Shixu weekly calendar with example schedules', zh: '拾序周日历与示例日程'},
  caption: {en: 'Calendar and scheduling', zh: '日历与日程安排'}, claimIds: ['calendar']},
 {id: 'shixu-assistant', projectId: 'shixu', type: 'screenshot', src: './shixu/assets/assistant.jpg', width: 1440, height: 1000,
  alt: {en: 'Shixu web local-rule assistant', zh: '拾序网页本地规则助手'},
  caption: {en: 'Web local-rule assistant; desktop cloud models are configured separately', zh: '网页本地规则助手；桌面云模型另行配置'}, claimIds: ['assistant-proposals']},
 {id: 'shixu-widgets', projectId: 'shixu', type: 'screenshot', src: './shixu/assets/widgets.jpg', width: 1440, height: 1000,
  alt: {en: 'Shixu component layout preview', zh: '拾序组件排布预览'},
  caption: {en: 'Component layout; native desktop widgets require Windows', zh: '组件排布预览；原生桌面组件在 Windows 使用'}, claimIds: ['widget-layout']}
].map(item => ({...item, evidenceKind: 'owner-supplied', provenance: {en: 'Published Shixu product imagery with example items', zh: '拾序官网已公开产品素材，使用示例事项'}, capturedAt: null, versionLabel: null, publication: 'approved'} as ProjectMedia));
