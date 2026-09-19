import type {Locale} from './state.js';
import type {CaseStudy} from './case-types.js';
export const aiCases: Record<string, Record<Locale, CaseStudy>> = {
  "fairy": {
    "zh": {
      "tagline": "一个住在桌面上的 AI 助手，也是一套能处理项目与资料的工作空间。",
      "purpose": "Fairy 不只是一个会动的桌宠。我希望它既能以有形象的方式陪伴用户，也能完成实际工作：对话、检索文档资料、调用工具、展示任务进展和预览生成的文件。它以 Windows 桌面为主要形态，把普通聊天和围绕某个项目的工作分开组织。",
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
      "tagline": "A desktop presence with a practical workspace for AI, projects and documents.",
      "purpose": "Fairy is more than an animated desktop pet. The project brings conversation, document retrieval, tools, task activity and file previews into a Windows-first application. General chat and project-scoped work are kept separate so the assistant can have both a recognisable presence and a practical place in a workflow.",
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
      "workflowNote": "下面是持久化任务设计的示意，用来解释开发目标与职责分工，不是一次端到端运行测试或性能承诺。",
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
          "title": "持久化任务",
          "body": "任务不只活在一次浏览器请求里。开发工作包括保存任务标识与状态，让中断后的恢复有依据。"
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
          "title": "重复请求与用户边界",
          "body": "同一请求重试时要能识别；读取、取消和恢复任务时也必须核验身份，避免跨用户访问。"
        },
        {
          "title": "可检查的接口约定",
          "body": "通过契约与冒烟检查关注接口形状、代理边界和失败处理。这里不把检查文件的存在当作整套系统已上线。"
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
        }
      ]
    },
    "en": {
      "tagline": "Not another chat interface: the shared capabilities and execution state behind two products.",
      "purpose": "MojoCore is the shared foundation for MojoClaw and MojoAX, not a third end-user chat application. Both workbenches need models, tools, artifacts, tasks and recovery. Keeping these responsibilities in Core prevents each interface from inventing its own execution logic.",
      "audience": "Consumed by applications such as MojoClaw and MojoAX. End users experience its behaviour through those workbenches rather than opening Core directly.",
      "scenario": "“I refresh the page halfway through a task. When I return, show its real progress instead of starting it again or leaving a spinner running forever.”",
      "workflowNote": "This illustrative sequence explains persistent-task responsibilities and development goals. It is not an end-to-end test result or a performance guarantee.",
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
          "title": "Persistent tasks",
          "body": "Work on task identifiers and saved states gives recovery something more dependable than an in-flight browser request."
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
          "title": "Duplicate requests and identity boundaries",
          "body": "Retries need recognition. Reading, cancelling and restoring a task also require verified identity rather than trusting client-supplied ownership."
        },
        {
          "title": "Checkable contracts",
          "body": "Contract and smoke checks focus on interface shapes, proxy boundaries and failure behaviour. Test-file presence is not a production release claim."
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
        }
      ]
    }
  },
  "claw": {
    "zh": {
      "tagline": "给个人使用的 AI 工作台：把聊天、项目任务和生成文件放在一起。",
      "purpose": "MojoClaw 面向个人日常使用。它的重点不是单纯“能和模型聊天”，而是在同一个工作空间里组织会话、项目、任务和结果，让用户既能提出要求，也能跟踪过程并打开生成的文件。",
      "audience": "需要用 AI 处理个人项目、资料与内容工作的用户。界面希望保持清晰，不把企业级信息密度直接搬给个人。",
      "scenario": "“这次工作不要只留下一段回答：把讨论、任务进展和生成文件放在同一个项目里，之后还能回来继续。”",
      "workflowNote": "这是工作台用途与流程示意，依据简历和项目文档整理；不代表当前已验证的公网会话或每一项操作均已发布。",
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
          "title": "流式反馈与恢复",
          "body": "跟随 Core 展示执行进度，并围绕取消、重新进入会话和历史载入持续迭代。"
        },
        {
          "title": "有边界的前后端集成",
          "body": "通过产品适配层和薄代理接入 Core，产品保留自己的交互，不另造模型选择或执行事实。"
        },
        {
          "title": "面向实际故障的迭代",
          "body": "开发经历包括认证、模型供应商错误和聊天流程排查；失败信息需要解释真正的问题，而不是统一显示“模型不可用”。"
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
      "tagline": "A personal AI workbench for conversations, project tasks and the files they produce.",
      "purpose": "MojoClaw is aimed at individual use. Its focus extends beyond chatting with a model: conversations, projects, tasks and outputs belong in one workspace so users can make a request, follow the process and inspect generated files.",
      "audience": "People using AI for personal projects, documents and content work. The interface is intended to stay focused rather than inherit enterprise-level information density.",
      "scenario": "“Keep the discussion, task progress and generated files together in this project so I can come back and continue the work.”",
      "workflowNote": "This is an illustrative explanation based on the CV and project documentation, not a verified hosted session or a claim that every operation has shipped.",
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
          "title": "Streaming and restoration",
          "body": "Show execution updates and iterate on cancellation, reopened conversations and historical state."
        },
        {
          "title": "Bounded frontend/backend integration",
          "body": "Product adapters and a thin proxy connect to Core without introducing a second model-selection or execution authority."
        },
        {
          "title": "Failure-led iteration",
          "body": "Development includes authentication, provider-error and chat-flow investigation so failures describe the actual problem."
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
      "workflowNote": "这是根据工作台设计说明整理的用途示意，不是已部署客户案例。审批、身份与其他企业集成的可用性须按实际模块核验。",
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
          "body": "对执行过程与生成文件提供可阅读的位置。企业审批和其他接入仍需区分已连接、占位和未验证状态。"
        }
      ],
      "capabilities": [
        {
          "title": "按任务出现的工作界面",
          "body": "仓库描述了按需工作面板的设计。浏览器、文件、代码、生成物等界面围绕当前工作组织，而不是全屏同时堆放。"
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
          "title": "明确未完成的企业能力",
          "body": "仓库同时记录了企业接入中的占位与迁移内容。单点登录、多租户及各连接器不能仅凭界面存在就被写成全面可用。"
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
          "title": "不把占位结构当作交付",
          "body": "区分页面已经接线、外部服务已经联通和完整业务流程已经验收。只有证据支持的层级才写成完成。"
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
          "body": "单点登录与多个组织的数据／身份边界。存在接口或占位不表示完整能力已验收。"
        }
      ]
    },
    "en": {
      "tagline": "A team-facing AI workbench that brings forward the surfaces a task actually needs.",
      "purpose": "MojoAX explores AI work for teams and organisations. Business tasks involve reference material, files, execution and review as well as answers. The workbench organises those elements around current activity instead of filling the screen with every tool at once.",
      "audience": "Teams working with AI in a business context. The enterprise-facing experience is deliberately distinct from MojoClaw and is not presented as a fully delivered ERP.",
      "scenario": "“For this document-based business task, show the material being used, the current step and the files produced at the end.”",
      "workflowNote": "An illustrative workflow drawn from the documented workbench design, not a deployed customer case. Approval, identity and enterprise integrations need module-specific verification.",
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
          "title": "Review activity and output",
          "body": "Execution steps and generated files have a readable place. Connected, scaffolded and unverified enterprise features remain distinct."
        }
      ],
      "capabilities": [
        {
          "title": "Task-relevant surfaces",
          "body": "The repository describes an on-demand surface design for browser, files, code and artifacts, rather than a permanent wall of panels."
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
          "title": "Explicit unfinished integrations",
          "body": "The documentation also identifies enterprise scaffolds and migration work. SSO, tenancy and connectors are not declared complete just because a surface exists."
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
          "title": "Do not equate scaffolding with delivery",
          "body": "A wired screen, a connected external service and an accepted end-to-end workflow are different levels of completion."
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
          "body": "Single sign-on and organisational identity/data boundaries. An interface or scaffold is not evidence of completed acceptance."
        }
      ]
    }
  }
};
