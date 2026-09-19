import type {Locale} from './state.js';
import type {CaseStudy} from './case-types.js';
export const archiveCases: Record<string, Record<Locale, CaseStudy>> = {
  "dreambound": {
    "zh": {
      "tagline": "一个梦境主题的浏览器 Canvas 游戏项目，探索游戏画面与交互界面。",
      "purpose": "Dreambound Realm 是旧作品集里的游戏项目。与以对话和业务信息为主的 AI 项目不同，它关注浏览器里的游戏画布、角色呈现和状态反馈。原始 HTML 可以看到 “Memory Tide” 章节入口、生命值／技能界面、梦境选择面板和章节结束界面。",
      "audience": "作为早期交互作品展示，面向想了解我在游戏界面和浏览器体验方面探索的访客。当前提供源码记录，不提供已验证的试玩。",
      "scenario": "“从章节开始画面进入梦境，在游戏画面中查看生命和技能状态，再通过选择面板与结束画面组织体验。”",
      "workflowNote": "下面是原始 HTML 暴露的界面结构示意，不证明游戏逻辑已完整运行。此次读取的目录中缺少入口引用的游戏脚本。",
      "workflow": [
        {
          "title": "章节入口",
          "body": "标题画面显示 Chapter I — Memory Tide，并提供开始按钮与角色图片。"
        },
        {
          "title": "画布与状态",
          "body": "游戏 Canvas 配合房间、生命值、技能和 Echo Knight 的状态界面。"
        },
        {
          "title": "选择与结束",
          "body": "HTML 定义 Dream Blessing 选择面板，以及章节结束和再次开始入口；逻辑运行未核验。"
        }
      ],
      "capabilities": [
        {
          "title": "游戏画面容器",
          "body": "原始页面使用独立 Canvas，并在页面层叠加状态界面，而不是普通内容卡片。"
        },
        {
          "title": "明确的游戏反馈区域",
          "body": "HTML 包括 HP、Skill、房间标记与 Boss 血条，可核对到相应界面元素。"
        },
        {
          "title": "多种界面状态",
          "body": "开始、选择、结束与重新开始的结构在页面中有定义。对应脚本是否完成需另行核验。"
        }
      ],
      "development": "这是我的早期作品记录。现有材料支持游戏入口、界面结构与素材组织的介绍，但未建立具体模块的个人代码归属，也未证明游戏逻辑可玩，因此不额外补写战斗机制、关卡数量或独立实现比例。",
      "decisions": [
        {
          "title": "能够具体展示的部分",
          "body": "游戏画布、状态面板、选择和结束界面提供了比“做过 Canvas 游戏”更具体的项目上下文。"
        },
        {
          "title": "仍需要补齐的部分",
          "body": "入口引用了输入、渲染、战斗和关卡等脚本，但本次读取没有拿到这些运行文件，不能把引用列表当成功能完成清单。"
        }
      ],
      "relationship": "它是独立的早期浏览器游戏探索，不属于 Fairy 或 Mojo 的后端。作品集保留它，是为了展示交互方向的宽度，而不是声称它具备 AI 智能体能力。",
      "terms": [
        {
          "title": "Canvas",
          "body": "浏览器中用来绘制图形和游戏画面的区域。"
        },
        {
          "title": "HUD / 状态界面",
          "body": "叠加在游戏画面上的生命值、技能、房间等信息。"
        }
      ]
    },
    "en": {
      "tagline": "A dream-themed browser Canvas game exploring game presentation and interaction.",
      "purpose": "Dreambound Realm is an earlier game project. It explores a browser game canvas, character presentation and visible state rather than conversation or business information. The original HTML exposes a Memory Tide chapter entry, HP and skill displays, a choice panel and a chapter-end screen.",
      "audience": "An earlier interaction project for visitors interested in game-interface exploration. This edition offers source records, not a verified playable build.",
      "scenario": "“Move from the chapter title into a dream-themed game view, read health and skill state, and encounter choice and end-screen interfaces.”",
      "workflowNote": "An illustrative map of interface structures in the original HTML, not proof that the game loop runs. The inspected directory did not provide referenced game scripts.",
      "workflow": [
        {
          "title": "Enter the chapter",
          "body": "The title screen names Chapter I — Memory Tide and provides a start button with character art."
        },
        {
          "title": "Read the game state",
          "body": "Canvas is accompanied by room, HP, skill and Echo Knight status displays."
        },
        {
          "title": "Choose or restart",
          "body": "The HTML defines Dream Blessing choices and end/restart screens. Their running logic was not verified."
        }
      ],
      "capabilities": [
        {
          "title": "Game presentation container",
          "body": "The original page combines a Canvas with a separate overlay interface instead of ordinary content cards."
        },
        {
          "title": "Defined feedback regions",
          "body": "HP, skill, room and boss-health elements are directly visible in the source HTML."
        },
        {
          "title": "Multiple screen states",
          "body": "Start, choice, end and restart structures are defined. That alone does not establish completed gameplay."
        }
      ],
      "development": "This is an earlier project record. The materials establish the entry screen, interface structure and asset organisation, but do not establish personal authorship of each module or verify playable logic. No combat mechanics, level count or implementation percentage is invented.",
      "decisions": [
        {
          "title": "What can be explained concretely",
          "body": "The canvas, status panels, choice overlay and end screen provide specific context beyond the label “Canvas game”."
        },
        {
          "title": "What remains missing",
          "body": "The entry references input, renderer, combat and level scripts that were not retrieved. References are not treated as implemented-feature evidence."
        }
      ],
      "relationship": "An independent browser-game exploration, not part of the Fairy or Mojo backend and not claimed to contain AI agent functionality.",
      "terms": [
        {
          "title": "Canvas",
          "body": "The browser surface used to draw graphics and game imagery."
        },
        {
          "title": "HUD",
          "body": "On-screen health, skill, room and other game-state information."
        }
      ]
    }
  },
  "webchange": {
    "zh": {
      "tagline": "用于观察网页变化的桌面界面项目，而不是另一个聊天应用。",
      "purpose": "Web Change 的项目方向是网页变化监测：关注的是某个网页内容是否发生变化，以及如何在桌面工具里呈现这种信息。旧项目配置能确认 Electron renderer 这一界面形态，但没有提供可运行监测服务或线上演示。",
      "audience": "用途面向需要关注网页更新的人。当前展示的是界面项目记录，不能视为已经交付的定时监测或通知服务。",
      "scenario": "“我关心这个网页后续有没有变化，希望用一个桌面界面查看，而不是只把它当普通网页打开。”",
      "workflowNote": "以下为“网页变化监测”用途示意，非已验证功能流程；网页采集、历史比较和通知实现均未从现有材料确认。",
      "workflow": [
        {
          "title": "关注一个页面",
          "body": "网页是需要观察的对象，这是原记录注明的用途，而非对已实现输入功能的承诺。"
        },
        {
          "title": "呈现变化信息",
          "body": "Electron renderer 是已知的展示层。变化数据从哪里来、如何比较，现有材料没有交代。"
        },
        {
          "title": "由用户查看",
          "body": "项目意图是让变化信息可查看；自动通知、运行频率和后台服务不在已核实范围内。"
        }
      ],
      "capabilities": [
        {
          "title": "网页变化这一明确问题",
          "body": "区别于一般桌面 UI，它围绕网页是否更新这一使用目的组织。"
        },
        {
          "title": "Electron 桌面展示层",
          "body": "原配置将项目标为 Electron renderer，说明它是桌面应用中的网页界面部分。"
        },
        {
          "title": "演示与后端需要分开核验",
          "body": "界面可单独部署不代表监测服务已经运行；原记录的演示地址仍为空。"
        }
      ],
      "development": "早期作品记录。现有来源未给出具体页面、监测算法、后台实现或个人模块分工。本页解释项目目的和技术形态，不补写已完成抓取、比较、告警等功能。",
      "decisions": [
        {
          "title": "能从资料读出的设计方向",
          "body": "把网页变化作为一个独立桌面工具的使用场景，而不是在聊天中临时询问网页内容。"
        },
        {
          "title": "不能据名称推导的能力",
          "body": "“监测”这个名称不能自动证明定时任务、历史快照、通知通道或长期运行可靠性。"
        }
      ],
      "relationship": "这是独立的早期桌面界面探索。现有材料未说明它已经接入 Fairy、MojoCore 或其他自动化运行服务。",
      "terms": [
        {
          "title": "Electron",
          "body": "用网页技术构建桌面应用的一种方式。"
        },
        {
          "title": "Renderer / 渲染进程界面",
          "body": "用户看到的网页式界面部分，不等同于后台监测服务。"
        }
      ]
    },
    "en": {
      "tagline": "A desktop interface for observing website changes, not another chat application.",
      "purpose": "Web Change is aimed at website-change monitoring: whether a page has changed and how that information could be presented in a desktop tool. The earlier configuration identifies an Electron renderer, but provides neither a working monitoring service nor a deployed demo.",
      "audience": "The intended use is following website updates. What is shown here is an interface-project record, not a delivered scheduling or notification service.",
      "scenario": "“I want to follow changes to this page through a desktop interface rather than simply opening it as an ordinary website.”",
      "workflowNote": "An illustrative explanation of the monitoring purpose. Collection, comparison and notification behaviour are not confirmed by the available records.",
      "workflow": [
        {
          "title": "Follow a page",
          "body": "A website is the object of interest; this describes the documented purpose rather than asserting a completed input feature."
        },
        {
          "title": "Present change information",
          "body": "The Electron renderer is the known presentation layer. The source of comparison data is not documented."
        },
        {
          "title": "Inspect the information",
          "body": "Viewing page changes is the product intention. Notification channels, frequency and background services remain unverified."
        }
      ],
      "capabilities": [
        {
          "title": "A specific monitoring purpose",
          "body": "The project concerns whether a webpage updates, rather than being a generic desktop UI."
        },
        {
          "title": "Electron presentation layer",
          "body": "The old configuration calls it an Electron renderer: the web-based interface within a desktop application."
        },
        {
          "title": "Separate presentation from monitoring",
          "body": "A deployable renderer would not establish a running monitoring service. The recorded demo address was empty."
        }
      ],
      "development": "An earlier portfolio record. The sources do not establish individual screens, a comparison algorithm, backend implementation or personal module ownership. Collection, diffing and alert delivery are not added as completed features.",
      "decisions": [
        {
          "title": "A documented design direction",
          "body": "Explore webpage changes as a dedicated desktop-tool use case, rather than a temporary chat question."
        },
        {
          "title": "Capabilities not implied by the name",
          "body": "“Monitoring” does not establish scheduling, stored snapshots, notifications or reliable long-running operation."
        }
      ],
      "relationship": "An independent earlier desktop-interface exploration. No integration with Fairy, MojoCore or another automation service is established.",
      "terms": [
        {
          "title": "Electron",
          "body": "A way to build desktop applications with web technologies."
        },
        {
          "title": "Renderer",
          "body": "The web-based interface the user sees; not the same as a background monitoring service."
        }
      ]
    }
  },
  "goodnight": {
    "zh": {
      "tagline": "使用 Next.js 探索商店型网站，以及界面和服务端之间的配合。",
      "purpose": "Goodnight Store 是旧作品集中的商店项目，技术形态为 Next.js 应用。它与纯静态展示页不同：原记录明确提到需要数据库和服务端运行环境，才能以应用方式对外提供访问。",
      "audience": "商店型网站的浏览者是产品方向；本作品集面向访客展示该开发探索，不把它当作正在营业的商店。",
      "scenario": "“把商店式页面做成有服务端和数据库支撑的应用，而不是只有一张商品风格的静态海报。”",
      "workflowNote": "下面是依据原记录中 Next.js、服务端和数据库关系绘制的结构示意，不是已经验收的下单流程。",
      "workflow": [
        {
          "title": "浏览商店界面",
          "body": "以商店型页面承载内容是项目已知方向；现有资料未列出具体页面清单。"
        },
        {
          "title": "连接服务端运行",
          "body": "原记录指出需要服务端环境，不能只复制静态页面就认定完整应用已经上线。"
        },
        {
          "title": "通过数据库支持应用",
          "body": "数据库需求有记录，但数据结构、商品、订单与库存模块完成度没有证据。"
        }
      ],
      "capabilities": [
        {
          "title": "商店类应用方向",
          "body": "保留了 Goodnight Store 这一商业网站探索，不夸大为成熟电商业务。"
        },
        {
          "title": "Next.js 技术形态",
          "body": "原记录明确的应用框架，涉及的不仅是浏览器端的静态内容。"
        },
        {
          "title": "服务端部署依赖",
          "body": "应用需要另行部署到支持服务端的环境；目前的作品集没有提供已验证商店链接。"
        }
      ],
      "development": "这是早期商店应用项目。现有材料未说明商品管理、购物车、支付和订单的实现范围，也未证明真实交易或运营结果，因此本页不补写这些能力。",
      "decisions": [
        {
          "title": "应用与静态展示的区别",
          "body": "商店的视觉页面只是其中一层；原记录指出服务端与数据库也是运行条件。"
        },
        {
          "title": "需要后续核验的部分",
          "body": "只有查看对应项目源码并运行流程后，才能介绍具体商业功能，不能根据“Store”名称自动补齐。"
        }
      ],
      "relationship": "独立的早期 Web 应用探索，与 MojoAX 的企业工作台不是同一项目。没有材料证明它已使用 Mojo 的 AI 服务。",
      "terms": [
        {
          "title": "Next.js",
          "body": "用于构建网站和 Web 应用的框架，可以包含服务端逻辑。"
        },
        {
          "title": "服务端 / 数据库",
          "body": "应用运行与保存数据所依赖的环境；记录了依赖，不代表每个业务功能已实现。"
        }
      ]
    },
    "en": {
      "tagline": "A Next.js store application exploring the boundary between presentation and server-backed work.",
      "purpose": "Goodnight Store is an earlier commerce-oriented project built as a Next.js application. Unlike a purely static showcase, its original record explicitly identifies a database and a server runtime as deployment requirements.",
      "audience": "Store visitors are the product context. The portfolio presents a development exploration, not an operating shop.",
      "scenario": "“Make a store-style website into an application supported by a server and database, rather than only a static commerce-themed page.”",
      "workflowNote": "An illustrative structure derived from the recorded Next.js, server and database requirements; not an accepted checkout flow.",
      "workflow": [
        {
          "title": "Browse a store interface",
          "body": "A store-style experience is the documented direction; the available source does not list specific screens."
        },
        {
          "title": "Run the server application",
          "body": "The original record requires a server environment. A static page alone is not the full application."
        },
        {
          "title": "Use a database",
          "body": "A database requirement is documented. The data model and completion of product, order or inventory modules are not."
        }
      ],
      "capabilities": [
        {
          "title": "Commerce-oriented application",
          "body": "An earlier store exploration, not described as an established ecommerce business."
        },
        {
          "title": "Next.js application shape",
          "body": "The recorded framework includes more than a static browser-only presentation."
        },
        {
          "title": "Server deployment dependency",
          "body": "A suitable server-backed deployment is needed. No verified live store address is offered by this portfolio."
        }
      ],
      "development": "An earlier store-application project. The records do not define the delivery scope of catalogues, cart, payments or orders, and do not establish real transactions or operating results.",
      "decisions": [
        {
          "title": "Distinguish application from showcase",
          "body": "The visual storefront is one layer; the recorded server and database dependencies are also part of making an application run."
        },
        {
          "title": "Verify before describing transactions",
          "body": "Specific commerce features need their own source and runtime review rather than being inferred from the name “Store”."
        }
      ],
      "relationship": "A separate earlier Web application, not the MojoAX enterprise workbench. Integration with Mojo AI services is not established.",
      "terms": [
        {
          "title": "Next.js",
          "body": "A framework for websites and Web applications that can include server-side logic."
        },
        {
          "title": "Server / database",
          "body": "The runtime and stored-data infrastructure an application depends on. A dependency is not a completed business feature."
        }
      ]
    }
  },
  "tarot": {
    "zh": {
      "tagline": "围绕塔罗主题，探索怎样把生成式 AI 的文字组织为一份报告。",
      "purpose": "AI Tarot Reports 对应原站的 AI Tarot Report Generator。项目方向是塔罗分析和报告生成，形态为需要服务端的 Next.js 应用。它可以用来说明我对“生成内容如何成为一个完整应用体验”的早期探索，而不是宣称预测能力得到验证。",
      "audience": "面向对塔罗主题与生成式内容体验感兴趣的人。报告应理解为娱乐与表达，不是可以据此作重大决定的预测依据。",
      "scenario": "“围绕塔罗主题生成一份能够阅读的分析报告，而不只是得到一段零散的聊天回复。”",
      "workflowNote": "以下是报告生成用途示意，并非已运行服务。输入项、模型供应商、报告格式和导出方式没有从现有材料核实。",
      "workflow": [
        {
          "title": "围绕主题组织输入",
          "body": "项目以塔罗分析为主题；具体牌阵和输入控件，现有资料没有列明。"
        },
        {
          "title": "服务端处理生成请求",
          "body": "Next.js 与服务端需求有记录，但不能据此确定使用了哪家模型或哪套提示词。"
        },
        {
          "title": "以报告组织内容",
          "body": "原项目名明确报告生成目的；版式、文件导出和结果质量仍需查看应用本体。"
        }
      ],
      "capabilities": [
        {
          "title": "AI 内容生成方向",
          "body": "塔罗分析与报告生成是原项目明确的主题，不是这次改站临时编造的新功能。"
        },
        {
          "title": "报告式应用体验",
          "body": "项目方向关注如何承接生成结果，而不仅是展示一个通用聊天框。"
        },
        {
          "title": "Next.js 服务端应用",
          "body": "原记录指出需要服务端能力，当前没有已验证的在线生成服务入口。"
        }
      ],
      "development": "早期生成式应用探索。现有材料未建立模型、提示词、报告版式或个人实现范围的详细证据，因此不把这些补写为已经完成的技术成果。",
      "decisions": [
        {
          "title": "解释内容如何被承接",
          "body": "用“主题输入—生成—报告”的用途关系说明产品意图，同时标注哪些具体交互没有资料支持。"
        },
        {
          "title": "不把生成内容等同于可靠预测",
          "body": "AI 生成的塔罗叙述不作为预测准确性、健康、法律或财务建议的证明。"
        }
      ],
      "relationship": "独立的早期生成式 Web 应用记录，不是 Fairy 内置技能，也没有资料证明它已接入 MojoCore。",
      "terms": [
        {
          "title": "生成式 AI",
          "body": "根据输入生成文字内容；生成得流畅不代表事实或预测正确。"
        },
        {
          "title": "报告生成",
          "body": "把内容整理为可阅读结果的产品方向，具体导出格式在现有资料中未确认。"
        }
      ]
    },
    "en": {
      "tagline": "A tarot-themed exploration of turning AI-generated text into a report experience.",
      "purpose": "AI Tarot Reports corresponds to the earlier AI Tarot Report Generator. The recorded direction is tarot analysis and report generation in a server-backed Next.js application. It represents an early generative-content application, not validated predictive ability.",
      "audience": "People interested in tarot-themed generative content. Reports are an entertainment and expression context, not a basis for important decisions.",
      "scenario": "“Organise tarot-themed generated content into a readable report rather than leaving it as an isolated chat response.”",
      "workflowNote": "An illustrative account of the report-generation purpose, not a running service. Input fields, model provider, report format and export behaviour are unverified.",
      "workflow": [
        {
          "title": "Frame the theme",
          "body": "Tarot analysis is the documented subject. Specific spreads and input controls are not listed."
        },
        {
          "title": "Handle generation on a server",
          "body": "Next.js and server requirements are recorded, but do not establish a particular provider or prompt strategy."
        },
        {
          "title": "Organise a report",
          "body": "Report generation is explicit in the project name. Layout, file export and output quality require the application itself."
        }
      ],
      "capabilities": [
        {
          "title": "A defined generative-content topic",
          "body": "Tarot analysis and report generation come from the original project record rather than being newly invented features."
        },
        {
          "title": "A report-oriented experience",
          "body": "The direction explores how to present generated output beyond a generic chat box."
        },
        {
          "title": "Server-backed Next.js application",
          "body": "The original entry requires server capabilities. No verified live generation endpoint is offered here."
        }
      ],
      "development": "An earlier generative application exploration. The records do not establish detailed model, prompt, report-layout or personal implementation evidence. Those details are not promoted to delivered technical achievements.",
      "decisions": [
        {
          "title": "Explain the output context",
          "body": "The input–generation–report relationship explains the intention while leaving unsupported interaction details explicit."
        },
        {
          "title": "Do not equate generation with prediction",
          "body": "Generated tarot narratives do not establish predictive accuracy or provide medical, legal or financial guidance."
        }
      ],
      "relationship": "An independent earlier generative Web application, not a documented Fairy skill or a verified MojoCore integration.",
      "terms": [
        {
          "title": "Generative AI",
          "body": "Produces text from input; fluent output does not establish factual or predictive accuracy."
        },
        {
          "title": "Report generation",
          "body": "The intention to organise content into a readable result; specific export formats are not established here."
        }
      ]
    }
  },
  "converter": {
    "zh": {
      "tagline": "一个原生桌面格式转换工具，探索“选择输入—处理—得到输出”的实用流程。",
      "purpose": "Mi Format Converter 是旧作品集里记录的 Python / PyQt 桌面工具。它的目的很直接：围绕文件格式转换提供原生界面，而不是做浏览器聊天或项目协作平台。现有来源只确定了技术形态与用途，没有给出格式兼容表。",
      "audience": "用途面向需要进行文件格式转换的桌面用户。当前没有已验证的安装包与支持格式清单，不能据此判断某种文件一定能转换。",
      "scenario": "“通过一个桌面窗口完成格式转换，而不是把这项操作包装成一个聊天任务。”",
      "workflowNote": "下方是格式转换工具的通用用途示意，不是已核验的操作说明；文件类型、批量处理和转换质量没有足够资料支持。",
      "workflow": [
        {
          "title": "提供输入文件",
          "body": "文件是工具的处理对象。具体输入类型及选择界面没有在原记录中列出。"
        },
        {
          "title": "执行格式转换",
          "body": "这是项目名与原配置确定的用途；实际转换引擎和兼容范围仍需核验。"
        },
        {
          "title": "获得转换结果",
          "body": "输出应由原生程序交付。现有资料不能证明输出格式、速度或保真度。"
        }
      ],
      "capabilities": [
        {
          "title": "原生桌面工具形态",
          "body": "原记录明确为 PyQt 程序，不会以网页示意冒充可以直接运行的桌面工具。"
        },
        {
          "title": "文件格式转换用途",
          "body": "项目聚焦一个具体实用操作，而不是泛化的 AI 工作台。"
        },
        {
          "title": "Python / PyQt 技术探索",
          "body": "反映早期对 Python 图形界面的探索；不能据此推断转换引擎或文件支持数量。"
        }
      ],
      "development": "这是早期原生工具项目记录。来源未提供详细实现、可执行文件或质量测试，因此不增加“支持所有格式”“无损转换”“批量处理”等未经验证的描述。",
      "decisions": [
        {
          "title": "把单一操作做成界面",
          "body": "围绕输入、处理和输出表达一个实用工具的目标，区别于多功能工作台。"
        },
        {
          "title": "让运行条件可见",
          "body": "原生应用需要安装或运行程序。当前只提供原记录，不能承诺访客在网页中直接完成转换。"
        }
      ],
      "relationship": "独立的早期 Python 桌面工具，与 Fairy 的桌面助手和 Mojo 系列的 AI 运行体系是不同的项目。",
      "terms": [
        {
          "title": "PyQt",
          "body": "用于用 Python 构建原生图形界面的工具库。"
        },
        {
          "title": "格式兼容表",
          "body": "明确工具接受哪些输入、产生哪些输出；当前来源没有提供这一清单。"
        }
      ]
    },
    "en": {
      "tagline": "A native desktop format-conversion utility built around input, processing and output.",
      "purpose": "Mi Format Converter is an earlier Python / PyQt desktop tool. Its purpose is a native interface for file-format conversion, not browser chat or a collaborative workspace. The available record establishes the technology and purpose but does not provide a compatibility matrix.",
      "audience": "Desktop users who need format conversion are the intended context. No verified installer or supported-format list is provided, so compatibility with a particular file cannot be assumed.",
      "scenario": "“Perform a format-conversion task through a desktop window rather than turning the operation into a chat request.”",
      "workflowNote": "An illustrative account of the utility purpose, not verified operating instructions. File types, batch processing and conversion quality are not established.",
      "workflow": [
        {
          "title": "Provide an input",
          "body": "A file is the object of the task. Specific accepted formats and selection controls are not listed in the original record."
        },
        {
          "title": "Convert the format",
          "body": "Conversion is established by the name and entry. The engine and compatibility range still require verification."
        },
        {
          "title": "Inspect the output",
          "body": "The native program would deliver output. The records do not establish formats, speed or fidelity."
        }
      ],
      "capabilities": [
        {
          "title": "Native desktop form",
          "body": "The original entry identifies a PyQt program. A browser illustration is not presented as the executable application."
        },
        {
          "title": "Focused conversion purpose",
          "body": "The project addresses a specific utility operation rather than a general AI workbench."
        },
        {
          "title": "Python / PyQt exploration",
          "body": "An earlier graphical-interface project, without an invented conversion engine or supported-file count."
        }
      ],
      "development": "An earlier native-tool record. The source does not include detailed implementation, a tested executable or quality results. Claims such as all-format, lossless or batch conversion are not added.",
      "decisions": [
        {
          "title": "Give a focused operation an interface",
          "body": "Input, processing and output explain the utility goal without expanding it into an unsupported feature list."
        },
        {
          "title": "Make runtime requirements clear",
          "body": "A native application needs its program to be installed or run. The source record is not an in-browser conversion service."
        }
      ],
      "relationship": "A separate earlier Python desktop utility, distinct from Fairy and the Mojo AI runtime/workbench projects.",
      "terms": [
        {
          "title": "PyQt",
          "body": "A toolkit for building native graphical interfaces with Python."
        },
        {
          "title": "Compatibility matrix",
          "body": "The list of accepted inputs and produced outputs. The available project record does not include one."
        }
      ]
    }
  }
};
