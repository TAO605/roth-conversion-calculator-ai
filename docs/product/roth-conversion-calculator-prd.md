# Roth Conversion Calculator Google Tool Site PRD

版本：V1.3  
修订日期：2026-05-01  
文档状态：待评审  
产品定位：面向全球、以美国纳税居民为核心用户的 AI 赋能 Roth Conversion Calculator 工具站。网站以 Google 自然搜索获客，提供本地优先的 Roth IRA 转换测算、税费拆解、长期收益对比、AI 合规解读、报告导出和后续小版本可维护迭代能力。  

> 合规声明：本产品仅用于教育和演示，不构成税务、财务、法律或投资建议。所有税务规则、税率表和 AI 知识库必须以 IRS 官方资料为准，并在上线前由具备美国税务经验的专业人士复核。

## V1.3 执行手册工程化补充

2026-05-30 已对《罗斯转换计算器 V1.3 最终完整执行手册（全链路整合版）》完成当前项目基线评估。详细结论见 `docs/product/v1.3-current-state-gap-assessment.md`。

执行原则：

1. 采纳 V1.3 的“工具优先、隐私优先、输入即计算、结果前置、隐藏成本提示、支付方式对比”等方向。
2. 不直接采纳 “100% accurate”“you should convert”“Strongly recommend”“Optimal Conversion Amount”“唯一/最准确/零错误保障” 等税务 YMYL 高风险表达。
3. 保留当前 Next.js 15、动态 sitemap、内容集群、Methodology/Disclaimer/Editorial Policy 等 SEO 与合规基础设施，不把站点压缩成单页工具。
4. 把 V1.3 的极简 UI 作为后续 `Quick Estimate` 或 `Focused Calculator Mode` 的设计方向，而不是无审查替换全站。
5. 后续所有 V1.3 相关实施优先增加合规禁用语测试和计算回归测试，再进入 UI 与高级税务交互功能。

## 1. 产品目标

### 1.1 核心目标

1. 打造可竞争 Google 首页排名的 Roth Conversion Calculator 工具站，覆盖 `Roth Conversion Calculator`、`Roth IRA Conversion Calculator`、`Roth Conversion Tax Calculator`、`Roth Conversion Break Even Calculator` 等核心关键词。
2. 提供透明、可验证、可测试的 Roth 转换测算能力，帮助用户理解即时税费、长期税后价值差异和盈亏平衡年限。
3. 通过 AI 大模型降低税务术语理解门槛，但严格限制为规则科普、参数解释、结果解读和报告生成，不提供个性化决策建议。
4. 采用苹果风格的简洁、可信、高级工具站视觉语言，优先服务移动端与 Safari 用户，同时兼容 Chrome、Edge、Firefox。
5. 建立模块化架构、功能开关、灰度发布、自动化测试和一键回滚机制，支持后续小功能局部升级，不影响核心计算器。
6. 按 YMYL 内容标准建设 E-E-A-T 信任体系，通过作者、审核人、来源、更新时间、计算方法论和限制条件说明提高用户与搜索引擎信任。

### 1.2 MVP 成功标准

1. 用户可以在一个页面完成参数输入、实时计算、图表查看、AI 解读、分享链接和 PDF 报告下载。
2. 核心计算逻辑具备单元测试覆盖，覆盖报税身份、税率区间、basis、罚金、复利和盈亏平衡点。
3. 页面首屏可清晰看到工具本体，不做纯营销落地页。
4. Lighthouse 目标：Performance、SEO、Accessibility、Best Practices 均大于 90。
5. 生产部署支持 sitemap、robots、canonical、结构化数据、静态合规页面和基础博客内容。
6. 任一非核心新功能可通过配置开关关闭；部署异常可通过 Vercel 回滚到上一稳定版本。
7. MVP 聚焦“准确计算、SEO、移动端体验、AI 合规解释、报告导出、可维护回滚”，不把高成本苹果生态深度能力作为首版阻塞项。

## 2. 目标用户

| 用户分层 | 主要特征 | 核心需求 | 占比预估 |
|---|---|---|---|
| 年轻职场人 | 25-40 岁，美国纳税居民，收入上升期，当前税率可能低于未来退休税率 | 快速理解 Roth 转换是否值得进一步咨询 CPA | 45% |
| 临近退休人群 | 50-65 岁，有传统 IRA/401(k) 余额，关注 RMD、税负与退休收入结构 | 精准估算税费、长期差异和 5 年规则影响 | 30% |
| 专业从业者 | CPA、财务顾问、理财规划师 | 快速演示初步方案，导出报告给客户沟通 | 15% |
| 高净值/自雇人群 | 企业主、自由职业者、高收入人群 | 更细颗粒度的税务参数、州税、分批转换规划 | 8% |
| 全球跨境用户 | 美国境外但有美国税务申报需求的人群 | 用简单语言理解美国退休账户规则 | 2% |

## 3. 用户痛点

1. IRS 规则复杂：报税身份、递进税率、basis、转换后 5 年规则、59.5 岁规则、RMD、州税等变量多，手算容易错。
2. 免费工具功能残缺：常见计算器只算基础税费，缺少长期对比、盈亏平衡和可导出报告。
3. 结果不透明：多数工具不说明税率年份、公式、规则来源，用户难以信任。
4. 小白不知道怎么填：basis、marginal tax rate、retirement tax bracket 等参数缺少上下文解释。
5. 移动端体验差：输入密集、图表拥挤、结果难查看。
6. 合规风险高：若产品暗示“应该转换”或“最优金额”，会越过教育工具边界。
7. 后期维护难：税率更新、AI 模型升级、小功能反馈如果没有模块化边界，容易牵连核心工具。

## 4. 产品范围

### 4.1 MVP 必做

1. Roth 转换参数输入模块。
2. 核心计算引擎。
3. 实时结果卡片。
4. 增长对比折线图与税费构成图。
5. AI 参数指引、AI 结果解读、AI 规则解释助手。
6. 分享链接、PDF 报告、本地缓存。
7. IRS 税率表展示、FAQ、合规页面、博客基础内容。
8. SEO 基础设施：metadata、canonical、sitemap、robots、JSON-LD、内链。
9. 模块化迭代与回滚机制。

### 4.2 MVP 不做

1. 用户账户系统。
2. 云端保存个人财务数据。
3. 自动给出“是否应该转换”的结论。
4. 自动生成最优转换金额。
5. 付费订阅、邮件营销自动化。
6. 多语言版本。

### 4.3 V2 可选

1. 多场景横向对比。
2. 多年度分批转换模拟。
3. 账户系统与历史计算云同步。
4. 邮件发送报告。
5. 西班牙语、法语等多语言版本。
6. AI 知识库自动更新工作流。

## 5. 核心业务逻辑

### 5.1 输入参数

| 分组 | 字段 | 类型 | 默认值 | 校验 |
|---|---|---|---|---|
| 基础参数 | Conversion Amount | currency | 50000 | >= 0 |
| 基础参数 | Traditional IRA Total Balance | currency | 250000 | >= Conversion Amount，允许提示不阻断 |
| 基础参数 | After-Tax Basis | currency | 0 | >= 0，<= IRA Total Balance |
| 基础参数 | Filing Status | enum | Single | Single / MFJ / MFS / HOH |
| 基础参数 | Current Taxable Income | currency | 85000 | >= 0 |
| 基础参数 | State Marginal Tax Rate | percent | 0 | 0-15，允许用户自定义 |
| 进阶参数 | Age | number | 45 | 18-120 |
| 进阶参数 | Penalty Exception | boolean | false | true/false |
| 进阶参数 | Retirement Age | number | 65 | > Age，<= 100 |
| 进阶参数 | Expected Annual Return | percent | 7 | -20 至 20 |
| 进阶参数 | Retirement Marginal Tax Rate | percent | 22 | 0-50 |
| 进阶参数 | Inflation Rate | percent | 3 | 0-15 |
| 进阶参数 | Tax Payment Method | enum | Outside funds | Outside funds / Withhold from IRA distribution / Not sure |

### 5.2 计算规则

1. 应税转换金额：

```text
taxableConversion = conversionAmount * (1 - basis / traditionalIraBalance)
```

当 IRA 总余额为 0 或 basis 大于余额时，应给出校验提示，并使用安全默认值避免计算崩溃。

2. 联邦税：

```text
federalTax = tax(income + taxableConversion, filingStatus, taxYear)
           - tax(income, filingStatus, taxYear)
```

必须使用递进税率差额法，而不是简单用单一边际税率乘以转换金额。

3. 州税：

```text
stateTax = taxableConversion * stateMarginalTaxRate
```

MVP 不内置各州完整税法，仅让用户输入边际州税率，并解释该项需要用户或 CPA 确认。

4. 10% 罚金：

```text
earlyPenalty = age < 59.5 && !penaltyException ? taxableDistributionNotRolledToRoth * 10% : 0
```

产品必须区分“转换本身”与“用户扣留一部分 IRA 分配用于支付税费”。若转换金额全额进入 Roth IRA，通常不把转换金额直接作为 10% 罚金基数；若用户从 IRA 分配中留出现金缴税，则该留存部分可能触发早期分配规则。MVP 输入中应增加解释，避免把所有 59.5 岁以下转换都错误计入罚金。

罚金相关交互必须基于 `Tax Payment Method`：

1. `Outside funds`：默认不把转换金额计入 10% 罚金基数，但提示 5 年规则和其他分配规则。
2. `Withhold from IRA distribution`：提示扣留用于缴税的部分可能被视为未进入 Roth IRA 的分配，并可能触发 10% 附加税；MVP 可要求用户输入 estimated withheld amount。
3. `Not sure`：不输出确定罚金金额，显示教育提示，引导用户咨询 CPA 或税务专业人士。

5. Roth 转换未来价值：

```text
rothFutureValue = conversionAmount * (1 + expectedReturn) ^ yearsToRetirement
```

6. 不转换未来税后价值：

```text
traditionalFutureValue = conversionAmount * (1 + expectedReturn) ^ yearsToRetirement
traditionalAfterTaxValue = traditionalFutureValue * (1 - retirementMarginalTaxRate)
```

7. 税费外部支付假设：

MVP 默认假设用户使用 IRA 外部资金支付转换税费。若后续支持从 IRA 留存缴税，需要单独建模罚金与投资本金减少影响。

8. 盈亏平衡年限：

使用逐年模拟法，找到 `rothAfterTaxValue - traditionalAfterTaxValue >= upfrontTaxCost` 的最早年份。若在投资期内未达到，显示“未在当前假设期内达到盈亏平衡”，不输出误导性年限。

### 5.3 税务规则来源要求

1. Roth 转换与收入纳税规则以 IRS Publication 590-A 为主要依据。
2. Roth 分配、5 年规则、早期分配与 10% 附加税以 IRS Publication 590-B 为主要依据。
3. 2026 联邦税率与标准扣除等年度参数以 IRS 年度 tax inflation adjustments 和 Revenue Procedure 为准。
4. 页面必须显示税率适用年份、最后更新时间和来源链接。

### 5.4 计算准确度等级

结果页必须按准确度等级标注，避免用户误把估算结果当作完整税务建议。

| 等级 | 适用内容 | 展示要求 |
|---|---|---|
| High confidence | 联邦递进税估算、basis 免税比例、复利、基础盈亏平衡模拟 | 展示公式、税率年份、输入参数和来源 |
| User-estimated | 州税率、退休税率、未来收益率、通胀率 | 标记为 user assumption，允许用户调整 |
| Professional review required | RMD、Medicare IRMAA、ACA subsidy、NIIT、AMT、州级特殊规则、抵免资格变化 | 不在 MVP 中做确定计算，只给风险提示和专业咨询建议 |

### 5.5 Tax Impact Warnings

结果页和 AI 解读必须包含 “Tax Impact Warnings” 模块，提示 Roth conversion 会增加当年 taxable income，并可能影响：

1. Medicare IRMAA。
2. ACA premium tax credits / marketplace subsidy。
3. Social Security benefit taxation。
4. Child tax credit、education credits 等抵免资格。
5. Net Investment Income Tax (NIIT)。
6. Alternative Minimum Tax (AMT)。
7. Required Minimum Distributions (RMD) 相关规划。
8. 州税、地方税和州级退休收入规则。

MVP 不对上述项目输出确定金额，统一标记为 “outside this calculator's MVP scope”。

## 6. 功能需求

### 6.1 智能参数输入

1. 输入框采用大尺寸、移动端友好的苹果风格表单。
2. 每个参数必须有 tooltip 和 AI 指引入口。
3. 支持数字格式化、百分比格式化、空值保护和即时校验。
4. 支持 3 个场景预设：
   - Young Professional Low-Tax Window
   - Near-Retirement Planning
   - High-Net-Worth Estate Planning
5. 场景预设只能填充示例参数，必须标明“sample scenario”，不得暗示推荐。

### 6.2 结果展示

1. 首屏结果卡片：
   - Estimated Federal Tax
   - Estimated State Tax
   - Potential Early Distribution Penalty
   - Total Estimated Upfront Cost
   - Break-Even Year
   - Retirement After-Tax Difference
2. 图表：
   - Roth vs Traditional after-tax value line chart
   - Tax cost breakdown bar chart
3. 结果解读：
   - 基础解读由前端确定性模板生成。
   - AI 深度解读需调用服务端 API，并通过合规校验。

### 6.3 AI 规则解释助手

AI 功能面向用户时不得命名为 `AI Tax Advisor`、`AI Tax Consultant`、`AI Financial Advisor` 等可能暗示专业建议的名称。产品内统一使用以下命名之一：

1. AI Roth Conversion Explainer
2. AI Tax Education Assistant
3. Roth Rules AI Guide

默认推荐名称：`AI Roth Conversion Explainer`。

#### 6.3.1 AI 能力边界

允许：
1. 参数解释。
2. IRS 规则科普。
3. 计算结果的教育性解读。
4. 报告文字生成。
5. 引导用户咨询 CPA、财务顾问或税务专业人士。

禁止：
1. 回答“我应该转换吗”。
2. 回答“我最优应该转换多少钱”。
3. 给出个人税务、投资、法律决策建议。
4. 编造 IRS 规则或引用不存在来源。
5. 回答与 Roth IRA、美国退休账户、税务教育无关的问题。
6. 使用 “recommend”、“best move”、“optimal for you”、“you should” 等表达输出个性化决策建议。

#### 6.3.2 AI 模型策略

1. 模型层必须可配置，不把具体模型名写死在前端。
2. OpenAI 官方文档当前可确认 GPT-5 系列和 Responses API；若账户支持 GPT-5.5，可通过环境变量配置为主模型，否则使用官方可用的最新 GPT-5.x 模型。
3. 后端使用 Next.js Route Handler / Serverless API 代理调用，前端不暴露密钥。
4. 支持备用模型供应商，但 MVP 可以先只实现 OpenAI provider interface。
5. AI 输出必须追加统一免责声明。

#### 6.3.3 AI 合规校验层

1. 输入过滤：识别决策类、无关类、越狱类请求。
2. 检索约束：规则类内容优先基于项目内 IRS 摘要知识库和官方来源链接。
3. 输出过滤：检测 forbidden phrases，例如 “you should convert”、“optimal amount is”、“I recommend converting”。
4. 免责声明强制追加：

```text
This Roth Conversion Calculator is for educational and illustrative purposes only. It does NOT constitute tax, financial, legal, or investment advice. The calculation results are based on the information you provide and the latest IRS tax rules, which are subject to change. We do not guarantee the accuracy of the results. Please consult a licensed Certified Public Accountant (CPA), financial advisor, or tax professional before making any financial decisions.
```

#### 6.3.4 AI 降级策略

1. 模型接口不可用时，AI 入口显示 “AI explanation is temporarily unavailable”，核心计算器仍可完整使用。
2. 高频 FAQ 可使用人工审核过的静态回答作为降级内容。
3. 降级内容同样必须附带免责声明。
4. AI 模块不得阻塞页面首屏加载，必须懒加载。

### 6.4 分享、报告与缓存

1. 分享链接：将非敏感参数编码进 URL query 或 hash。默认不上传服务器。
2. PDF 报告：包含输入参数、计算结果、图表、AI 解读、公式说明、来源链接、免责声明。
3. 本地缓存：使用 localStorage 保存最近一次参数；提供清除按钮。
4. 隐私提示：明确“计算参数默认只保存在本地浏览器”。

### 6.5 合规静态页面

必须包含：
1. Privacy Policy
2. Terms of Service
3. Disclaimer
4. About
5. Calculation Methodology
6. Editorial Policy

隐私政策必须说明：
1. 计算数据默认本地处理。
2. AI 请求可能会将用户主动提交的上下文发送到模型服务商。
3. 不应输入 SSN、账号、姓名、地址等敏感个人信息。
4. 使用 GA4、Vercel Analytics、Sentry 时需说明 Cookie/事件用途。

### 6.6 Calculation Methodology 页面

必须公开说明：

1. 使用的核心公式。
2. 税率适用年份。
3. 联邦税差额法如何计算。
4. basis 如何按比例影响应税转换金额。
5. 默认假设用户用 IRA 外部资金支付税费。
6. 哪些项目不在 MVP 计算范围内，包括 IRMAA、ACA subsidy、NIIT、AMT、RMD、州级特殊规则。
7. 最后更新时间。
8. IRS 官方来源链接。

## 7. SEO 需求

### 7.1 页面结构

1. 首页即工具页，H1 使用 `Roth Conversion Calculator`。
2. 首屏必须包含可交互计算器，而不是只有营销文案。
3. H2/H3 覆盖：
   - Roth IRA Conversion Tax Estimate
   - Roth Conversion Break-Even Analysis
   - Roth Conversion Rules
   - FAQ
4. 每个核心内容模块都应有可索引文本，不依赖客户端隐藏内容承载 SEO 主体。

### 7.2 元数据

首页建议：

```text
Title: Roth Conversion Calculator 2026 | Estimate Taxes & Break-Even
Meta Description: Free Roth conversion calculator for 2026. Estimate federal tax, state tax, potential penalties, break-even years, and Roth vs traditional IRA after-tax value.
```

博客与合规页面必须有唯一 title、description、canonical。

### 7.3 结构化数据

1. 使用 JSON-LD。
2. 首页使用 `WebApplication` 或 `SoftwareApplication` 描述工具本体。
3. FAQ 区域仅在页面可见且符合 Google 结构化数据政策时使用 `FAQPage`。
4. 博客使用 `Article` 或 `BlogPosting`。
5. 站点导航使用 `BreadcrumbList`。
6. 不写“Calculator 专用富摘要保证”。Google 不保证正确标记后一定展示富结果，PRD 只能要求符合规范、通过测试。

### 7.4 技术 SEO

1. 生成 `sitemap.xml`，URL 使用完整绝对地址。
2. 生成 `robots.txt` 并引用 sitemap。
3. 所有可索引页面有 canonical。
4. 重要页面不得被 `noindex`、robots 或登录墙阻挡。
5. 页面主内容服务端渲染或静态生成，计算交互客户端增强。
6. 图片使用明确 alt 文本，避免装饰图占据主内容。

### 7.5 E-E-A-T 与 YMYL 信任要求

Roth conversion 属于税务/财务相关 YMYL 内容，SEO 不只依赖关键词，还必须建立可信度。

必须实现：

1. 每篇文章显示作者、作者简介和专业背景。
2. 税务规则类页面显示 reviewer 或 “reviewed by tax professional” 字段；上线前如未完成专业审核，必须明确显示 “Editorial review pending”。
3. 所有规则内容显示 `Last updated` 日期。
4. 关键段落链接到 IRS 官方来源。
5. 独立 `Calculation Methodology` 页面说明公式、假设和限制。
6. 独立 `Editorial Policy` 页面说明内容如何撰写、审核、更新。
7. About 页面说明网站定位为教育工具，不是税务服务机构。
8. AI 生成内容不得直接发布到博客，必须人工编辑和审核后才可索引。

### 7.6 内容计划

MVP 上线 5 篇英文文章：

1. What Is a Roth Conversion and How Does It Work in 2026?
2. Is a Roth Conversion Worth It? Key Factors to Understand
3. How the 5-Year Rule Works for Roth Conversions
4. Roth Conversion Taxes: Federal, State, and Penalty Basics
5. Backdoor Roth Conversion: A Complete Guide for High Earners

文章必须保持教育性，避免个性化建议。每篇文章链接回计算器，计算器链接到相关文章和 IRS 官方来源。

### 7.7 程序化 SEO 页面规划

V2 可规划州级长尾页面，但必须避免薄内容。

候选页面：

1. Roth Conversion Calculator California
2. Roth Conversion Calculator Texas
3. Roth Conversion Calculator Florida
4. Roth Conversion Calculator New York
5. Roth Conversion Calculator Washington
6. Roth Conversion Calculator Nevada

上线条件：

1. 每个州页面必须有真实差异化内容，包括州税处理、是否有个人所得税、州级注意事项、官方来源。
2. 页面必须包含同一个计算器实例，但预设州税率或解释不同。
3. 不允许批量生成只有州名不同的低质量页面。
4. 州级页面必须经过 SEO 与合规复核后再提交 sitemap。

## 8. UI/UX 需求

### 8.1 设计方向

采用苹果风格的高可信金融工具界面：克制、清晰、明亮、少装饰、强层级。首屏应让用户立即开始计算，不做厚重营销 hero。

### 8.2 视觉规范

1. 字体：优先使用系统字体栈，苹果设备呈现 SF Pro，其他设备使用 Segoe UI / system-ui。
2. 主色：Apple System Blue `#007AFF`。
3. 状态色：系统绿表示收益，系统红表示成本/风险，系统橙表示提示。
4. 卡片：轻量毛玻璃或半透明层，但必须保证可读性和 WCAG 对比度。
5. 圆角：核心工具卡片可使用 16-20px，输入与按钮使用 10-14px。
6. 不使用大面积紫色渐变、装饰性光球、与金融工具无关的插画。

### 8.3 交互规范

1. 输入即计算，无需点击 Calculate。
2. 移动端数字字段唤起 numeric keyboard。
3. AI 对话采用 Messages 风格：用户气泡右侧，AI 气泡左侧。
4. 错误提示就近显示，不使用阻断式弹窗。
5. 图表在移动端可横向滚动或自适应简化，不能挤压文本。
6. 支持暗黑模式与 reduced motion。

### 8.4 无障碍

1. 键盘可完成完整流程。
2. 表单字段有 label、description、error message。
3. 图表提供文本摘要。
4. AI 流式输出对屏幕阅读器友好，不频繁打断朗读。
5. 颜色不能作为唯一信息表达方式。

### 8.5 MVP 范围收敛

以下苹果生态深度能力不作为 MVP 必做，移入 V2/V3：

1. Siri 快捷指令。
2. AirDrop 专属集成。
3. 通用剪贴板专属适配。
4. Force Touch 触发 AI 指引。
5. 动态岛/刘海屏专属体验。
6. 原生级 Web App 全屏沉浸体验。

MVP 只要求：

1. Safari 兼容。
2. iPhone/iPad/Mac 响应式体验良好。
3. 自动适配明暗模式。
4. 可添加到主屏幕的基础 PWA 能力。
5. reduced motion 与 VoiceOver 友好。

## 9. 技术栈建议

| 模块 | 选型 | 说明 |
|---|---|---|
| 框架 | Next.js 15+ App Router | SSG/SSR、SEO、Route Handler、Vercel 适配 |
| 语言 | TypeScript | 强类型保护计算逻辑 |
| 样式 | Tailwind CSS + shadcn/ui | 快速搭建可维护的苹果风格组件 |
| 表单 | React Hook Form + Zod | 类型安全、校验清晰 |
| 图表 | Recharts | React 友好、响应式、轻量 |
| AI | OpenAI Responses API via server route | 模型可配置、服务端代理、流式输出 |
| PDF | jsPDF + html2canvas 或服务端 PDF 方案 | MVP 优先前端生成，复杂报告后续升级 |
| 测试 | Vitest/Jest + Testing Library + Playwright/Cypress | 单元、组件、E2E |
| 部署 | Vercel | 原子部署、预览环境、快速回滚 |
| 监控 | Vercel Analytics + Sentry + GA4/GSC | 性能、错误、SEO 监控 |
| 功能开关 | 环境变量 + Edge Config/Vercel KV | 小版本灰度和热关闭 |

### 9.1 商业化合规边界

后续若引入广告、联盟营销或 CPA 推荐，必须满足：

1. 广告不得遮挡或干扰计算器核心输入与结果。
2. 联盟链接必须清晰标注 affiliate disclosure。
3. 不推荐具体投资产品、证券、券商或税务方案。
4. CPA/Advisor 推荐必须标注商业关系和筛选标准。
5. 商业化模块必须独立于核心计算器，通过功能开关控制。
6. 广告脚本不得显著拖慢 Core Web Vitals。
7. 不得因商业合作影响 AI 输出或计算结果排序。

## 10. 架构与模块边界

### 10.1 分层

| 层级 | 内容 | 小版本权限 |
|---|---|---|
| Core Layer | 计算引擎、税率数据、合规校验、设计 token、SEO 核心配置 | 小版本禁止直接改动 |
| Common Layer | UI 基础组件、hooks、格式化、本地缓存、AI provider、PDF 工具 | 小版本仅可新增，不直接改旧逻辑 |
| Feature Layer | AI 参数指引、复制结果、历史记录、FAQ、报告模板、非核心 UI 调整 | 小版本主要操作区 |

### 10.2 建议目录

```text
src/
  app/
    page.tsx
    blog/
    privacy/
    terms/
    disclaimer/
    about/
    api/ai/
  core/
    calculator/
    tax-data/
    compliance/
    seo/
  common/
    ui/
    hooks/
    format/
    storage/
    analytics/
  features/
    calculator-input/
    result-summary/
    charts/
    ai-assistant/
    pdf-report/
    share-link/
    faq/
    tax-impact-warnings/
    methodology/
  config/
    feature.config.ts
  tests/
```

### 10.3 功能开关

每个非核心模块必须有：

```ts
export const featureConfig = {
  aiAssistant: {
    enabled: true,
    version: "1.0.0",
    grayRate: 100,
    mountPosition: "floating-panel",
  },
  pdfReport: {
    enabled: true,
    version: "1.0.0",
    grayRate: 100,
    mountPosition: "result-actions",
  },
  coreCalculator: {
    enabled: true,
    version: "1.0.0",
    locked: true,
  },
} as const;
```

## 11. 测试与验收

### 11.1 单元测试

覆盖：
1. 递进联邦税计算。
2. Filing status 税率表选择。
3. Basis 免税比例。
4. 州税。
5. 罚金条件。
6. 复利。
7. 盈亏平衡模拟。
8. 输入校验。
9. AI 合规输出过滤。

### 11.2 组件测试

覆盖：
1. 参数改变后结果实时更新。
2. 场景预设填充。
3. tooltip 与 AI 指引按钮可访问。
4. 图表数据与计算结果一致。
5. 本地缓存恢复。

### 11.3 E2E 测试

核心路径：
1. 打开首页。
2. 修改转换金额、收入、basis、报税身份。
3. 查看结果卡片和图表。
4. 生成分享链接。
5. 下载报告。
6. 打开 AI 助手并提问合规问题。
7. 输入决策类问题，AI 拒绝给建议。

### 11.4 SEO 验收

1. 首页 title、description、H1 正确。
2. sitemap 可访问并包含核心页面。
3. robots 引用 sitemap。
4. Rich Results Test 无结构化数据错误。
5. Search Console 可提交 sitemap。
6. 页面无阻挡 Googlebot 的规则。

### 11.5 性能验收

1. LCP < 2.5s。
2. INP < 200ms。
3. CLS < 0.1。
4. 首屏 JS 控制体积，AI/PDF 模块懒加载。
5. 图片与字体不造成布局跳动。

## 12. 小版本迭代与回滚

### 12.1 小版本允许范围

允许：
1. 新增独立辅助功能。
2. 新增 FAQ、博客、tooltip。
3. 优化单个 Feature Layer 组件。
4. 新增 AI 预设问题。
5. 优化报告模板。

禁止：
1. 改核心计算公式。
2. 改 IRS 税率底层数据。
3. 改 AI 合规红线。
4. 改全站隐私/数据安全底层逻辑。
5. 改 SEO 核心策略导致收录风险。

### 12.2 发布流程

1. 建立独立分支：`feature/<module>-v1.0.x`。
2. 只改 `src/features/<module>` 或配置文件。
3. 写模块测试和核心回归测试。
4. 部署 Vercel Preview。
5. 灰度开启 5%-10%。
6. 观察 Sentry、Vercel Analytics、GA4。
7. 无异常后全量开启。
8. 更新 changelog 和版本号。

### 12.3 回滚级别

| 级别 | 场景 | 操作 | 生效目标 |
|---|---|---|---|
| 配置级回滚 | 单个模块异常 | 关闭 feature flag | 最快，影响最小 |
| 部署级回滚 | 新版本影响全站 | Vercel 回滚上一部署 | 恢复稳定生产版本 |
| 模块级回滚 | 单模块需降级 | 切换模块版本引用 | 保留其他改动 |
| Git revert | 复杂冲突 | revert 对应 commit | 清除本次迭代 |

### 12.4 版本号规范

1. 大版本：核心计算逻辑、税务年度、架构或合规策略变化，例如 `2.0.0`。
2. 功能版本：新增独立功能模块，例如 `1.1.0`。
3. 小版本：文案、UI、FAQ、非核心 bug 修复，例如 `1.0.1`。
4. 每个版本必须记录：
   - 修改模块。
   - 修改原因。
   - 测试结果。
   - 回滚方式。
   - 上线时间。

## 13. 合规与风险

### 13.1 法律与税务风险

风险：用户误认为工具提供专业建议。  
应对：
1. 全站醒目免责声明。
2. AI 禁止输出决策建议。
3. 所有规则内容附 IRS 来源。
4. 上线前 CPA 复核。
5. 用户报告与 AI 回复都包含免责声明。

### 13.2 计算错误风险

应对：
1. 税率数据版本化。
2. 计算公式单测。
3. 显示税率年份和更新时间。
4. 每年 IRS 更新后 15 个工作日内更新。

### 13.3 AI 幻觉风险

应对：
1. 规则问答优先引用受控知识库。
2. 输出后处理检测禁用语。
3. 高风险问题拒答。
4. 提供“Report issue”反馈入口。

### 13.4 SEO 风险

应对：
1. 不堆砌关键词。
2. 结构化数据必须与可见内容一致。
3. 内容原创、及时更新。
4. AI 内容必须人工审核后发布。

### 13.5 运维风险

应对：
1. Vercel 原子部署。
2. Sentry 错误监控。
3. 功能开关。
4. 自动化测试门禁。

## 14. 项目里程碑

| 阶段 | 周期 | 交付物 | 验收 |
|---|---|---|---|
| 1. PRD 定稿 | 第 1 周 | PRD、规则来源清单、SEO 初始关键词清单 | PRD 通过评审 |
| 2. UI/UX 设计 | 第 2 周 | 苹果风格线框、高保真、组件规范 | 移动/桌面方案通过 |
| 3. 技术设计 | 第 3 周 | 架构设计、数据模型、测试计划 | 模块边界明确 |
| 4. MVP 开发 | 第 4-6 周 | 计算器、AI、图表、报告、SEO 页面 | 核心功能完成 |
| 5. 测试修复 | 第 7 周 | 单测、组件测试、E2E、性能报告 | 阻断 bug 清零 |
| 6. 上线准备 | 第 8 周 | Vercel、域名、GSC、GA4、Sentry | 生产验收通过 |
| 7. 运营迭代 | 上线后 | 内容更新、小版本迭代、监控报告 | 稳定增长 |

### 14.1 MVP 优先级

P0：
1. 核心计算器。
2. 税费支付方式与罚金边界。
3. 结果卡片与图表。
4. 合规声明。
5. SEO 基础设施。
6. Methodology 页面。
7. AI Roth Conversion Explainer 的合规问答与结果解读。

P1：
1. PDF 报告。
2. 分享链接。
3. FAQ。
4. 博客 5 篇。
5. 本地缓存。
6. E-E-A-T 作者与审核字段。

P2：
1. 州级程序化 SEO 页面。
2. 多场景对比。
3. 高级商业化模块。
4. 苹果生态深度能力。

## 15. 最终交付物

1. PRD 文档。
2. 技术架构设计文档。
3. UI/UX 设计稿与组件规范。
4. Next.js 源码。
5. 测试用例与测试报告。
6. SEO 配置与关键词报告。
7. 合规页面文案。
8. AI Prompt 与合规规则文档。
9. 部署文档。
10. 维护与回滚手册。

## 16. 官方来源

1. IRS Publication 590-A：Roth conversion、IRA 转换、收入纳税规则。https://www.irs.gov/publications/p590a
2. IRS Publication 590-B：Roth IRA 分配、5 年规则、早期分配与 10% 附加税。https://www.irs.gov/publications/p590b
3. IRS 2026 tax inflation adjustments：2026 年税率与通胀调整参数来源。https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill/
4. Google SEO Starter Guide：Google 搜索基础与内容规范。https://developers.google.com/search/docs/fundamentals/seo-starter-guide
5. Google Structured Data Guidelines：结构化数据政策与测试要求。https://developers.google.com/search/docs/appearance/structured-data/sd-policies
6. Google Sitemaps：sitemap 生成与提交规范。https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
7. Apple Human Interface Guidelines：苹果设计原则。https://developer.apple.com/design/human-interface-guidelines/
8. OpenAI Models：OpenAI 官方模型列表。https://platform.openai.com/docs/models
9. OpenAI Responses API：AI 调用推荐接口。https://platform.openai.com/docs/api-reference/responses
10. OpenAI Safety Best Practices：安全、审核与人工监督建议。https://platform.openai.com/docs/safety-best-practices/understanding-safety-risks
