import type {Locale} from './state.js';
import type {CaseStudy} from './case-types.js';
export const aiCases: Record<string, Record<Locale, CaseStudy>> = {
  "fairy": {
    "zh": {
      "tagline": "以成为个人终端的智能助手为目标，将对话、资料检索与受控工具操作融入日常工作。",
      "purpose": "Fairy 的目标是成为个人终端上的智能助手，而不只是一个会动的桌宠。当前以 Windows 桌面为主要形态，围绕对话、文档资料、受控工具操作、任务进展和文件预览持续开发；普通聊天与项目工作分别组织，桌宠和语音是交互入口，而不是产品的全部。",
      "audience": "适合希望在电脑上把 AI 对话、资料和项目任务放在一起使用的人，而不只是打开一个独立聊天网页。",
      "scenario": "“围绕这个项目里的资料回答我的问题，把需要的工具步骤和生成的文件留在同一个工作区。”",
      "workflowNote": "下面根据项目文档说明使用逻辑，是流程示意，不是原生应用实测录屏；具体能力取决于模型、工具配置及当前版本。",
      "workflow": [
        {
          "title": "进入对应工作区",
          "body": "临时问题进入普通会话；与某个项目有关的工作进入项目会话，让任务有明确的上下文。"
        },
        {
          "title": "提供资料与能力",
          "body": "把管理的文档作为检索材料，并配置可用模型或工具。不是让模型不受限制地访问整台电脑。"
        },
        {
          "title": "观察任务执行",
          "body": "对话、模型轮次、工具调用和取消属于可记录的任务过程；有副作用的操作要经过规定的命令边界。"
        },
        {
          "title": "查看结果再决定",
          "body": "阅读回答、打开文件预览，或对项目修改进行审查。实时陪伴与本地模型能力仍需各自的验收。"
        }
      ],
      "capabilities": [
        {
          "title": "聊天与项目不会混为一谈",
          "body": "普通对话处理随手提问，项目工作区把会话、任务和生成物放到具体项目下。重点是让后续工作找得到上下文。"
        },
        {
          "title": "让模型使用受约束的工具",
          "body": "MCP 用于接入工具，Skills 用于组织可复用的工作说明。模型提出的调用仍需通过权限、参数和执行边界，不能等同于直接运行。"
        },
        {
          "title": "结合文档回答问题",
          "body": "文档检索把相关资料提供给模型，帮助回答围绕已有内容的问题。它与长期记忆分开管理，也不等于每个答案天然正确。"
        },
        {
          "title": "不只输出一段文字",
          "body": "项目文档描述了任务时间线、生成物和预览能力。使用者能够看到工作进行到哪里，以及得到的文件是什么。"
        },
        {
          "title": "语音和具有形象的桌面交互",
          "body": "语音输入／输出、桌宠动画和窗口交互，让助手不局限于键盘聊天。实时陪伴是另一条 Beta 能力线，不与普通语音混为一谈。"
        },
        {
          "title": "本地优先，而非一律断网",
          "body": "应用有本地 Core，也可配置云端模型或可选云服务。“本地优先”不表示所有模型与工具都在离线环境完成。"
        }
      ],
      "development": "我使用 Codex、Claude 辅助拆解需求、理解仓库和实现功能，并围绕模型接入、桌宠动画、窗口交互与故障复现持续迭代。我的工作不是把生成的代码直接视为成品，而是检查运行结果，再把发现的问题转化为下一轮可验证的修改。",
      "decisions": [
        {
          "title": "把一个愿望变成可以开发的任务",
          "body": "例如把“桌宠更自然”拆成动画状态、窗口位置、输入框行为和点击区域，而不是只让 AI “再做漂亮一点”。"
        },
        {
          "title": "区分自动化通过与真实桌面可用",
          "body": "构建、单元测试、真实窗口操作验证的是不同问题。重点检查原生桌面中的位置、焦点、输入与状态，不只看测试数量。"
        },
        {
          "title": "把模型能力与应用责任分开",
          "body": "模型可以生成候选操作，但任务状态、权限和执行记录由系统负责。这样才能明确一次操作为什么发生、是否完成。"
        }
      ],
      "relationship": "Fairy V3 有自己的 Core、能力适配器和桌面壳；它不是直接使用 MojoCore 的另一个皮肤。两条项目线都在探索 AI 应用，但这里不把它们画成未经证实的共享后端。",
      "terms": [
        {
          "title": "MCP",
          "body": "把外部工具接入 AI 应用的一种协议。能接入不代表模型获得无限权限。"
        },
        {
          "title": "RAG / 文档检索",
          "body": "先在资料中寻找相关片段，再把这些材料交给模型组织回答。"
        },
        {
          "title": "Tauri / Core",
          "body": "Tauri 提供桌面应用外壳；Fairy Core 负责应用内部的任务和业务逻辑。"
        },
        {
          "title": "STT / TTS",
          "body": "分别把语音转成文字、把文字转成语音；与完整实时陪伴不是同一个验收范围。"
        }
      ]
    },
    "en": {
      "tagline": "Building an intelligent assistant for personal devices, bringing conversations, document retrieval and controlled tool use into everyday work.",
      "purpose": "Fairy aims to become an intelligent assistant on personal devices, not just an animated desktop pet. Current development centres on Windows: conversations, documents, controlled tool use, task progress and file previews. Ordinary chat and project work are organised separately; the companion appearance and voice are ways to interact, rather than the entire product.",
      "audience": "For people who want AI conversations, reference documents and project work together on their computer, rather than only in a separate chat page.",
      "scenario": "“Help me work with the documents in this project. Keep the conversation, tool steps and resulting files in the same workspace.”",
      "workflowNote": "This is an illustrative walkthrough based on project documentation, not a recorded native-app test. Available behaviour depends on model, tool configuration and version.",
      "workflow": [
        {
          "title": "Choose a workspace",
          "body": "Use a general conversation for a quick question, or a project conversation for work that needs a defined context."
        },
        {
          "title": "Supply context and capabilities",
          "body": "Managed documents provide retrieval material. Models and tools must be configured; this is not unrestricted access to the computer."
        },
        {
          "title": "Follow the task",
          "body": "Messages, model rounds, tool calls and cancellation belong to a recorded task. Side effects cross explicit command boundaries."
        },
        {
          "title": "Inspect the result",
          "body": "Read the answer, open a file preview or review proposed project changes. Realtime companion and local-model paths have separate acceptance requirements."
        }
      ],
      "capabilities": [
        {
          "title": "Chat with a place for project context",
          "body": "General conversations handle quick questions. Project workspaces associate conversations, tasks and artifacts with a specific piece of work."
        },
        {
          "title": "Tools with explicit boundaries",
          "body": "MCP connects tools and Skills package reusable instructions. Proposed calls still pass through policy, parameter and execution checks."
        },
        {
          "title": "Answers informed by documents",
          "body": "Retrieval supplies relevant managed-document material to a model. Documents are separate from canonical memory, and retrieval does not guarantee correctness."
        },
        {
          "title": "Visible work, not only generated text",
          "body": "The documentation describes a task timeline, artifacts and previews: a way to understand the activity and inspect what was produced."
        },
        {
          "title": "Voice and a desktop character",
          "body": "Speech input/output, animated appearance and window interaction extend the interface. Realtime Companion is a separate Beta track, not a synonym for ordinary voice."
        },
        {
          "title": "Local-first does not mean offline-only",
          "body": "The application has its own local Core, with configurable cloud models and optional cloud services. Individual capabilities have different network requirements."
        }
      ],
      "development": "I use Codex and Claude for requirement breakdown, repository understanding and implementation, then iterate on provider integration, pet animation, window interaction and reproducible faults. Generated code is an intermediate result: I inspect behaviour and turn the remaining problems into focused, verifiable changes.",
      "decisions": [
        {
          "title": "Make a broad idea actionable",
          "body": "Break “make the pet feel natural” into animation states, window position, input behaviour and hit-testing rather than a single vague visual request."
        },
        {
          "title": "Separate tests from native acceptance",
          "body": "A build, a unit test and a real desktop interaction check establish different things. Window focus, placement and input need observation beyond test counts."
        },
        {
          "title": "Separate model proposals from application authority",
          "body": "The model proposes operations; the system owns task state, permissions and execution records. That boundary helps explain what happened and whether it finished."
        }
      ],
      "relationship": "Fairy V3 has its own Core, capability adapters and desktop shell. It is not presented as another skin over MojoCore. The two project lines explore related problems without an invented shared-backend relationship.",
      "terms": [
        {
          "title": "MCP",
          "body": "A protocol for connecting tools to an AI application. A connection does not grant unrestricted execution permission."
        },
        {
          "title": "RAG / retrieval",
          "body": "Find relevant passages in reference material before asking a model to compose an answer with that context."
        },
        {
          "title": "Tauri / Core",
          "body": "Tauri provides the desktop shell; Fairy Core owns task and application logic."
        },
        {
          "title": "STT / TTS",
          "body": "Speech-to-text and text-to-speech. These are distinct from acceptance of a complete realtime companion."
        }
      ]
    }
  },
  "core": {
    "zh": {
      "tagline": "不负责“长什么样”，而负责 AI 任务背后的共同能力与执行状态。",
      "purpose": "MojoCore 是 MojoClaw 和 MojoAX 共用的后端基础，不是给普通用户单独打开的第三个聊天软件。两个工作台需要模型、工具、文件、任务与状态恢复；把这些共享能力放在 Core，界面就不用各自维护一套相互冲突的执行逻辑。",
      "audience": "直接服务于 MojoClaw、MojoAX 这样的应用及其开发过程。普通用户通过工作台使用它，而不是直接操作 Core。",
      "scenario": "“一个任务进行到一半，我刷新页面再回来：它应该继续显示真实进展，而不是重新开始或永远转圈。”",
      "workflowNote": "依据本机源码核对的任务生命周期示意：创建请求 → 持久化事件 → 流式展示 → 取消或恢复。它解释实现结构，不代表本次执行了一次真实模型任务。",
      "workflow": [
        {
          "title": "接收同一个任务",
          "body": "工作台提交请求，Core 结合身份与请求标识处理任务，避免界面重试时把同一请求默认为全新工作。"
        },
        {
          "title": "记录发生的事情",
          "body": "任务状态和事件由后端保存。界面显示来自 Core 的进度，而不靠聊天文本或本地计时猜测完成状态。"
        },
        {
          "title": "处理取消与重复请求",
          "body": "取消、重试和重复提交需要有明确规则。已经进入终态的任务不能因为迟到事件又变回执行中。"
        },
        {
          "title": "重新打开仍能读懂",
          "body": "通过事件重放和会话快照恢复内容与状态，让用户看见发生过什么、现在是否还有任务运行。"
        }
      ],
      "capabilities": [
        {
          "title": "共享能力入口",
          "body": "把模型接入、工具、知识资料和生成物等共同能力留在核心层，产品界面通过约定的接口消费。"
        },
        {
          "title": "持久化任务与事件游标",
          "body": "网关将任务和事件写入 PostgreSQL；事件带有递增序号，客户端可以从上次读取的位置继续重放，将刷新后的恢复和实时 SSE 连接到同一份执行记录。"
        },
        {
          "title": "事件重放与流式响应",
          "body": "执行过程可以逐步推送给前端，也可以按记录重新读取。实时进度和历史恢复不应维护两套事实。"
        },
        {
          "title": "取消与终态保护",
          "body": "取消不是简单隐藏加载图标；系统要记录任务已取消，并防止之后的回调把状态悄悄改回去。"
        },
        {
          "title": "幂等请求与身份校验",
          "body": "请求携带幂等键；重复提交会核对请求内容与身份，冲突返回明确错误。任务事件按租户与任务读取，避免重试产生重复执行或跨身份复用。"
        },
        {
          "title": "可检查的接口约定",
          "body": "通过契约与冒烟检查关注接口形状、代理边界和失败处理。这里不把检查文件的存在当作整套系统已上线。"
        },
        {
          "title": "统一终态与结果投影",
          "body": "成功、失败、取消和超时以持久化终态事件为依据。网关核对事件类型与状态的一致性，并将记录投影为前端可恢复的任务状态。"
        }
      ],
      "development": "我的开发工作集中在共享运行能力、任务生命周期、恢复与接口检查。我借助 AI coding agent 读取相关模块、拆解改动、处理实现，再根据状态和接口的实际表现持续纠偏。",
      "decisions": [
        {
          "title": "先确定谁拥有状态",
          "body": "前端负责展示，Core 负责执行事实。修复历史记录和任务状态问题时，先找事实来源，而不是只改界面的 loading 状态。"
        },
        {
          "title": "把异常流程也写进任务",
          "body": "除了正常回答，还需要关注取消、重复提交、权限失败、迟到事件和刷新恢复。这些行为会影响用户能否相信界面。"
        },
        {
          "title": "用接口边界约束 AI 修改",
          "body": "告诉 coding agent 哪些代码属于产品、哪些属于共享运行时，并针对边界运行检查，避免为了修一个界面问题复制后端逻辑。"
        }
      ],
      "relationship": "MojoClaw 是个人工作台，MojoAX 是企业工作台，MojoCore 提供它们共同使用的能力。Fairy 则有自己的 Core；相似的设计关注点不代表已经共享同一套后端。",
      "terms": [
        {
          "title": "Durable run / 持久化任务",
          "body": "把任务状态保存下来，而不是只放在内存或一个正在等待的请求中。"
        },
        {
          "title": "Replay / Hydrate",
          "body": "Replay 是重新读取事件；Hydrate 是用保存的快照恢复界面需要的状态。"
        },
        {
          "title": "幂等性",
          "body": "同一个请求再次送达时，不应无意中重复执行同一项工作。"
        },
        {
          "title": "SSE / 流式事件",
          "body": "服务器持续把进展发给浏览器，让用户逐步看到执行结果。"
        },
        {
          "title": "事件游标 / afterSeq",
          "body": "标记已经读到哪一条事件。重新连接时从该位置继续获取记录，减少重复内容。"
        }
      ]
    },
    "en": {
      "tagline": "Not another chat interface: the shared capabilities and execution state behind two products.",
      "purpose": "MojoCore is the shared foundation for MojoClaw and MojoAX, not a third end-user chat application. Both workbenches need models, tools, artifacts, tasks and recovery. Keeping these responsibilities in Core prevents each interface from inventing its own execution logic.",
      "audience": "Consumed by applications such as MojoClaw and MojoAX. End users experience its behaviour through those workbenches rather than opening Core directly.",
      "scenario": "“I refresh the page halfway through a task. When I return, show its real progress instead of starting it again or leaving a spinner running forever.”",
      "workflowNote": "A source-reviewed illustrative lifecycle: request creation → persisted events → streaming display → cancellation or recovery. This explains the implementation; no live model run was executed in this review.",
      "workflow": [
        {
          "title": "Identify the request",
          "body": "The workbench submits a request with identity and request identifiers. A retry must not automatically become unrelated new work."
        },
        {
          "title": "Record what happens",
          "body": "Core persists task state and events. The interface displays that evidence rather than inferring completion from text or timers."
        },
        {
          "title": "Handle interruption",
          "body": "Cancellation, retries and duplicate requests need explicit rules. A late callback must not silently revive a terminal task."
        },
        {
          "title": "Recover the view",
          "body": "Event replay and conversation snapshots restore what happened and which tasks remain active when the view is reopened."
        }
      ],
      "capabilities": [
        {
          "title": "Shared capability interfaces",
          "body": "Common model, tool, knowledge and artifact capabilities sit behind Core interfaces consumed by the product shells."
        },
        {
          "title": "Durable runs and event cursors",
          "body": "The gateway persists runs and events in PostgreSQL. Ordered event sequences let clients resume replay from a cursor, connecting refresh recovery and live SSE to the same execution record."
        },
        {
          "title": "Streaming and event replay",
          "body": "Progress can be delivered as it happens and read again from stored events. Live and historical views should not become competing sources of truth."
        },
        {
          "title": "Cancellation and terminal-state guards",
          "body": "Cancelling is more than removing a spinner. The system records the outcome and protects it from conflicting later callbacks."
        },
        {
          "title": "Idempotency and identity checks",
          "body": "An idempotency key is checked against request content and identity; conflicting reuse produces an explicit error. Event reads are scoped by tenant and run instead of treating retries as new work."
        },
        {
          "title": "Checkable contracts",
          "body": "Contract and smoke checks focus on interface shapes, proxy boundaries and failure behaviour. Test-file presence is not a production release claim."
        },
        {
          "title": "Consistent terminal events",
          "body": "Success, failure, cancellation and timeout are represented by persisted terminal events. The gateway checks event/status consistency and projects the record into recoverable task state."
        }
      ],
      "development": "My work focuses on shared runtime capabilities, task lifecycle, recovery and interface checks. I use AI coding agents to inspect the relevant modules, break down changes and implement them, then refine the result against observed state and interface behaviour.",
      "decisions": [
        {
          "title": "Decide who owns state",
          "body": "The UI presents the work; Core owns execution facts. Investigating stuck history or task displays starts with the authoritative record, not only the loading indicator."
        },
        {
          "title": "Include failure paths",
          "body": "Cancellation, duplicate submission, permission failures, late events and refresh recovery matter alongside the successful-answer path."
        },
        {
          "title": "Constrain cross-module changes",
          "body": "Give coding agents explicit product-versus-runtime boundaries and check them, instead of fixing a screen by copying backend logic into it."
        }
      ],
      "relationship": "MojoClaw is the personal workbench and MojoAX the enterprise workbench; both consume MojoCore. Fairy has its own Core. Related engineering concerns do not establish a shared backend between all four.",
      "terms": [
        {
          "title": "Durable run",
          "body": "A task whose state is stored beyond an in-memory operation or a single open request."
        },
        {
          "title": "Replay / hydrate",
          "body": "Replay reads recorded events again. Hydration restores the saved state needed by the interface."
        },
        {
          "title": "Idempotency",
          "body": "Receiving the same request again should not unintentionally repeat the same work."
        },
        {
          "title": "SSE",
          "body": "Server-sent events: a stream of progress updates from the server to the browser."
        },
        {
          "title": "Event cursor / afterSeq",
          "body": "The last event sequence a client has read. Reconnection can continue from this position rather than repeating the entire stream."
        }
      ]
    }
  },
  "claw": {
    "zh": {
      "tagline": "面向个人用户的 AI SaaS 服务，通过网页与桌面工作台组织对话、项目任务和生成文件。",
      "purpose": "MojoClaw 面向个人用户，以 AI SaaS 服务为产品方向，提供网页与桌面两种入口。我希望用户不只获得一次聊天回答，而是能在工作台里组织对话、项目任务和生成文件。共享能力与执行状态由 MojoCore 承担，网页和桌面端负责呈现和交互；这一定位不代表订阅计费或所有服务已正式上线。",
      "audience": "需要用 AI 处理个人项目、资料与内容工作的用户。界面希望保持清晰，不把企业级信息密度直接搬给个人。",
      "scenario": "“这次工作不要只留下一段回答：把讨论、任务进展和生成文件放在同一个项目里，之后还能回来继续。”",
      "workflowNote": "依据当前 Web、Electron 与共享任务状态代码整理的流程示意；本次核对实现，不将它表述为已录制的真实模型会话。",
      "workflow": [
        {
          "title": "围绕事情组织会话",
          "body": "临时讨论留在聊天里，需要持续推进的工作围绕项目和任务组织，减少内容散落。"
        },
        {
          "title": "通过 Core 执行",
          "body": "工作台把请求经适配层交给 MojoCore，核心负责模型与执行逻辑，界面不重复决定同一个任务怎么运行。"
        },
        {
          "title": "看进展与生成物",
          "body": "界面接收流式进度，展示任务和文件预览。用户可以把“发生了什么”与“得到什么”联系起来。"
        },
        {
          "title": "回来继续或停止",
          "body": "取消或重新进入会话时，界面应读取核心状态，避免一直转圈、错误归类失败或显示其他会话的结果。"
        }
      ],
      "capabilities": [
        {
          "title": "对话、项目与任务组织",
          "body": "把对话关联到正在做的事情，让用户不是只在一长串消息里查找项目内容。"
        },
        {
          "title": "生成文件预览",
          "body": "在工作台中承接 Core 返回的生成物与预览，区分会话内容和文件结果。"
        },
        {
          "title": "有序事件与会话恢复",
          "body": "Web 复用桌面端共享的持久化任务状态逻辑，以 Core 的消息标识和事件序号合并内容。恢复时区分历史快照与新事件，避免旧状态覆盖当前任务。"
        },
        {
          "title": "有边界的前后端集成",
          "body": "通过产品适配层和薄代理接入 Core，产品保留自己的交互，不另造模型选择或执行事实。"
        },
        {
          "title": "面向实际故障的迭代",
          "body": "开发经历包括认证、模型供应商错误和聊天流程排查；失败信息需要解释真正的问题，而不是统一显示“模型不可用”。"
        },
        {
          "title": "HTML 生成物预览",
          "body": "专门的 HTML 预览逻辑承接生成页面，让文件结果与聊天内容分开阅读；预览可用性仍取决于 Core 返回的实际生成物。"
        }
      ],
      "development": "我借助 Codex、Claude 推进项目／任务界面、Core API 接入和交互迭代，并结合日志、聊天链路与针对性检查排查问题。相比只展示页面，我更关注界面能否表达任务实际发生的状态。",
      "decisions": [
        {
          "title": "让个人界面保持聚焦",
          "body": "把主要注意力放在当前对话、任务和结果上，不把底层每个模块都做成长期占位的面板。"
        },
        {
          "title": "不让前端猜结果",
          "body": "区分暂未结束、失败和已取消，恢复时优先读取 Core 保存的信息，避免表现出一个不存在的“完成”。"
        },
        {
          "title": "把问题写成可复现任务",
          "body": "将具体的会话恢复、认证或预览问题，拆成触发步骤、预期状态和检查范围，再交给 coding agent 修改。"
        },
        {
          "title": "共享状态逻辑，保留产品交互",
          "body": "Web 与桌面复用任务状态和消息排序模块，减少各端对同一事件作出不同解释；移动端是否具备同等体验需要单独验收。"
        }
      ],
      "relationship": "MojoClaw 与 MojoAX 共享 MojoCore，但面向的使用者与信息组织不同。前者是个人工作台，后者强调团队与业务场景；这里不暗示所有终端已经功能完全一致。",
      "terms": [
        {
          "title": "生成物 / Artifact",
          "body": "AI 工作产生的文件或其他可查看结果，与聊天中的一段文字区分管理。"
        },
        {
          "title": "适配层",
          "body": "让产品用自己的接口接入共享 Core，减少界面与核心实现互相耦合。"
        },
        {
          "title": "BFF / 薄代理",
          "body": "面向前端的服务入口，主要转发请求与身份，而不是另外运行一套 AI 编排。"
        }
      ]
    },
    "en": {
      "tagline": "An AI SaaS service for individuals, bringing conversations, project tasks and generated files together across web and desktop workspaces.",
      "purpose": "MojoClaw is being developed as an AI SaaS service for individuals, with web and desktop entry points. The aim is to organise conversations, project tasks and generated files in a workbench, rather than stopping at a single chat response. MojoCore owns shared capabilities and execution state; the product clients present the work and its controls. This positioning does not imply that subscriptions or every service are already publicly launched.",
      "audience": "People using AI for personal projects, documents and content work. The interface is intended to stay focused rather than inherit enterprise-level information density.",
      "scenario": "“Keep the discussion, task progress and generated files together in this project so I can come back and continue the work.”",
      "workflowNote": "An illustrative workflow reviewed against the current Web, Electron and shared task-state code. This is an implementation explanation, not a recorded live model session.",
      "workflow": [
        {
          "title": "Organise the conversation",
          "body": "Quick discussions stay in chat. Work that needs continuity is organised around projects and tasks."
        },
        {
          "title": "Execute through Core",
          "body": "A product adapter forwards requests to MojoCore. The workbench does not duplicate the core model-selection and execution responsibilities."
        },
        {
          "title": "Inspect progress and output",
          "body": "Streamed activity and artifact previews connect what the assistant did with what the task produced."
        },
        {
          "title": "Return or stop",
          "body": "Cancellation and restored conversations should reflect Core state rather than stuck indicators or results assigned to the wrong context."
        }
      ],
      "capabilities": [
        {
          "title": "Conversations with project structure",
          "body": "Associate discussions with ongoing work instead of relying only on a long, unstructured message history."
        },
        {
          "title": "Generated-file previews",
          "body": "Present artifacts and previews returned by Core while distinguishing file outputs from chat text."
        },
        {
          "title": "Ordered events and conversation recovery",
          "body": "The Web client reuses the desktop shared durable-run logic. Core message identities and event sequences guide merging, separating historical snapshots from new events so stale state does not overwrite current work."
        },
        {
          "title": "Bounded frontend/backend integration",
          "body": "Product adapters and a thin proxy connect to Core without introducing a second model-selection or execution authority."
        },
        {
          "title": "Failure-led iteration",
          "body": "Development includes authentication, provider-error and chat-flow investigation so failures describe the actual problem."
        },
        {
          "title": "HTML artifact previews",
          "body": "Dedicated HTML preview handling presents generated pages separately from chat. A usable preview still depends on an actual artifact returned by Core."
        }
      ],
      "development": "I use Codex and Claude to develop project/task interfaces, integrate Core APIs and iterate on interactions. Logs, chat-flow reproduction and focused checks guide debugging. The aim is not only a polished screen, but one that represents actual task state.",
      "decisions": [
        {
          "title": "Keep the personal interface focused",
          "body": "Prioritise the current conversation, task and output instead of permanently exposing every internal module."
        },
        {
          "title": "Do not guess the outcome in the frontend",
          "body": "Unfinished, failed and cancelled are different states. Restoration should rely on Core records rather than an invented success."
        },
        {
          "title": "Make faults reproducible",
          "body": "Translate restoration, authentication and preview problems into steps, expected state and a bounded change for the coding agent."
        },
        {
          "title": "Shared state logic across interfaces",
          "body": "Web and desktop reuse durable-run and message-ordering modules to reduce conflicting interpretations of the same event. Mobile parity requires its own acceptance checks."
        }
      ],
      "relationship": "MojoClaw and MojoAX share MojoCore but differ in audience and information organisation. This does not imply every desktop, web or mobile surface has verified feature parity.",
      "terms": [
        {
          "title": "Artifact",
          "body": "A generated file or inspectable result, managed separately from a passage of chat text."
        },
        {
          "title": "Adapter",
          "body": "A boundary through which a product consumes shared Core interfaces without depending on all implementation details."
        },
        {
          "title": "BFF / thin proxy",
          "body": "An entry point for the frontend that forwards requests and identity rather than running a separate AI orchestrator."
        }
      ]
    }
  },
  "ax": {
    "zh": {
      "tagline": "面向团队业务的 AI 工作台：根据正在做的任务，展示需要的工作界面。",
      "purpose": "MojoAX 关注团队和组织使用 AI 的场景。除了回答一个问题，业务工作还涉及资料、文件、执行过程和审查。它以工作台承接这些信息，让当前任务需要的界面出现，而不是一开始就把所有工具铺满屏幕。",
      "audience": "围绕业务任务使用 AI 的团队与组织。它与 MojoClaw 的个人使用场景有意区分，并不等于一套已经完整交付的 ERP。",
      "scenario": "“处理一项资料型业务任务时，让我看到当前用了什么资料、正在做哪一步，以及最后产出了什么文件。”",
      "workflowNote": "根据当前工作台和 Core 接入代码整理的流程示意，不是客户部署案例。本次核对界面控制与接口调用，未复测外部身份提供商、计费或企业业务全链路。",
      "workflow": [
        {
          "title": "提出有上下文的业务任务",
          "body": "把问题放在具体项目或工作区中，而不是让每段聊天失去与业务资料的关联。"
        },
        {
          "title": "任务决定当前工作界面",
          "body": "阅读资料时显示相应内容；处理文件或生成结果时让对应面板出现。不是要求用户不断猜该切哪个工具页。"
        },
        {
          "title": "把执行交给共享 Core",
          "body": "产品通过适配层消费共享能力，同时保留企业侧的界面组织与工作流程。"
        },
        {
          "title": "检查过程和结果",
          "body": "在任务进度、工具活动和生成物面板中检查工作；需要组织身份时，通过 Core 获取租户列表和切换结果。外部企业服务的实际可用性仍需独立验收。"
        }
      ],
      "capabilities": [
        {
          "title": "自动召唤、固定与分屏",
          "body": "Surface 控制器根据工具活动选择工作面板；用户可以固定当前面板或打开第二个面板。自动切换尊重固定状态，让阅读中的文件保持稳定。"
        },
        {
          "title": "企业侧的信息层级",
          "body": "围绕工作区、项目、执行过程和结果组织内容，不只是在个人版上替换名称与颜色。"
        },
        {
          "title": "共享能力的产品接入",
          "body": "通过 MojoAX 的适配层接入 Core，让企业界面与运行能力保持分工。"
        },
        {
          "title": "可见的执行过程",
          "body": "把任务步骤、工具调用和结果界面连接起来，帮助使用者理解 AI 正在做什么；不把示意面板当成真实运行数据。"
        },
        {
          "title": "SSO 与租户切换接入",
          "body": "当前控制器已接入 Core 的身份会话与租户接口：登录回调、会话刷新、组织列表和组织切换由界面协调，身份验证与租户事实仍由 Core 管理。"
        },
        {
          "title": "明确的加载与失败状态",
          "body": "租户控制器在服务响应前保留空白或加载状态，失败时显示错误，不在前端虚构一个已登录组织。接口接入与外部服务验收分别说明。"
        }
      ],
      "development": "我使用 AI 辅助开发企业工作台界面、接入共享服务，并把业务系统需求转成可实施的界面与集成任务。我的重点是信息如何出现、任务如何表达，以及界面如何和 Core 的状态保持一致。",
      "decisions": [
        {
          "title": "先确定业务需要看到什么",
          "body": "把需求转成具体工作情境和界面行为，再拆模块，不从“给企业加更多面板”开始。"
        },
        {
          "title": "让产品边界保持清楚",
          "body": "企业工作台负责自己的交互与信息架构；共享模型、工具和执行能力通过 Core 接入，避免产品之间互相复制。"
        },
        {
          "title": "用代码核对接入进度",
          "body": "旧设计中的占位说明可能已过时。核对实际控制器与 Core 调用后更新介绍，同时保留源码接入、服务联通和完整业务验收之间的区别。"
        }
      ],
      "relationship": "MojoAX 是企业工作台，MojoClaw 是个人工作台，MojoCore 为两者提供共享能力。企业侧差异主要体现在信息组织、工作情境与治理需求，而不是凭空多出一套独立 AI 引擎。",
      "terms": [
        {
          "title": "Surface / 工作面板",
          "body": "承载浏览器、文件、生成物等当前工作内容的界面区域。"
        },
        {
          "title": "信息架构",
          "body": "决定内容怎样分组、当前重点是什么，以及用户如何找到下一步。"
        },
        {
          "title": "SSO / 多租户",
          "body": "SSO 统一登录身份，多租户区分组织与访问范围。工作台调用 Core 管理这些状态；外部身份提供商和部署配置仍影响真实可用性。"
        }
      ]
    },
    "en": {
      "tagline": "A team-facing AI workbench that brings forward the surfaces a task actually needs.",
      "purpose": "MojoAX explores AI work for teams and organisations. Business tasks involve reference material, files, execution and review as well as answers. The workbench organises those elements around current activity instead of filling the screen with every tool at once.",
      "audience": "Teams working with AI in a business context. The enterprise-facing experience is deliberately distinct from MojoClaw and is not presented as a fully delivered ERP.",
      "scenario": "“For this document-based business task, show the material being used, the current step and the files produced at the end.”",
      "workflowNote": "An illustrative workflow based on current workbench and Core integration code, not a customer deployment. This review inspected controllers and API calls; it did not exercise external identity providers, billing or complete enterprise workflows.",
      "workflow": [
        {
          "title": "Give the task context",
          "body": "Associate a request with the relevant project or workspace instead of separating the discussion from its business material."
        },
        {
          "title": "Bring forward the right surface",
          "body": "Reading material, working with files and inspecting outputs call for different views. The task informs which view appears."
        },
        {
          "title": "Consume shared Core services",
          "body": "The product adapter connects shared capabilities while the enterprise shell keeps its own workflow and information hierarchy."
        },
        {
          "title": "Inspect progress and results",
          "body": "Review task progress, tool activity and artifacts. Organisation-aware work obtains tenant lists and switching results from Core; external enterprise service readiness needs separate acceptance."
        }
      ],
      "capabilities": [
        {
          "title": "Automatic surfaces, pinning and split view",
          "body": "The Surface controller selects a view from tool activity. Users can pin the current view or open a secondary pane; automatic selection respects pinning so a file remains stable while being read."
        },
        {
          "title": "Enterprise information hierarchy",
          "body": "Workspace, project, execution and output views are organised for the business context rather than simply rebranding the personal interface."
        },
        {
          "title": "Shared-service integration",
          "body": "The MojoAX adapter connects to Core while keeping product interaction separate from runtime responsibilities."
        },
        {
          "title": "Visible execution",
          "body": "Task steps, tool activity and result views help explain the work. An illustrative panel is not live operational evidence."
        },
        {
          "title": "SSO and tenant integration",
          "body": "Current controllers connect identity sessions and tenant operations to Core: the UI coordinates login callbacks, session refresh, organisation lists and switching, while Core owns authentication and tenant state."
        },
        {
          "title": "Explicit loading and failure states",
          "body": "Before the gateway responds, the tenant controller retains empty or loading states and reports failures rather than inventing a signed-in organisation. API wiring and external-service acceptance are tracked separately."
        }
      ],
      "development": "I use AI-assisted development to build enterprise workbench interfaces, connect shared services and translate business-system requirements into implementation tasks. My focus is how information appears, how tasks are expressed and how the product stays consistent with Core state.",
      "decisions": [
        {
          "title": "Start with the business activity",
          "body": "Translate requirements into a concrete work situation and interface behaviour before adding modules or panels."
        },
        {
          "title": "Keep product boundaries clear",
          "body": "The enterprise shell owns interaction and information architecture. Shared model, tool and execution capabilities are consumed through Core."
        },
        {
          "title": "Check implementation against older plans",
          "body": "Placeholder descriptions can become stale. Inspect current controllers and Core calls before updating claims, and distinguish source integration, service connectivity and full workflow acceptance."
        }
      ],
      "relationship": "MojoAX is the enterprise workbench, MojoClaw the personal workbench and MojoCore their shared capability foundation. The distinction concerns workflow, information and governance needs, not an invented separate AI engine.",
      "terms": [
        {
          "title": "Surface",
          "body": "An interface region for the material being worked on, such as a browser view, files or generated artifacts."
        },
        {
          "title": "Information architecture",
          "body": "How content is grouped, what receives attention and how users find the next action."
        },
        {
          "title": "SSO / multi-tenancy",
          "body": "SSO unifies sign-in; multi-tenancy separates organisations and access. The workbench calls Core to manage these states, while external identity providers and deployment configuration determine real availability."
        }
      ]
    }
  }
};
