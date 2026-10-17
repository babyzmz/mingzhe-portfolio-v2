import type {Locale} from './state.js';
import type {CaseStudy} from './case-types.js';
// MojoClaw, Mojo Core and MojoAX studies live in src/mojo-content.ts.
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
      "relationship": "Fairy V3 有自己的 Core、能力适配器和桌面壳；它不是直接使用 Mojo Core 的另一个皮肤。两条项目线都在探索 AI 应用，但这里不把它们画成未经证实的共享后端。",
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
      "relationship": "Fairy V3 has its own Core, capability adapters and desktop shell. It is not presented as another skin over Mojo Core. The two project lines explore related problems without an invented shared-backend relationship.",
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
  }
};
