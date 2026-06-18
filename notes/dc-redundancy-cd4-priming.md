# Dendritic Cell Redundancy Enables Priming of Anti-tumor CD4+ T Cells in Pancreatic Cancer

## Metadata

- Title: Dendritic cell redundancy enables priming of anti-tumor CD4+ T cells in pancreatic cancer
- Authors: Courtney T.S. Kureshi, Michael J. Walsh, Rakeeb Kureshi, Victoire Cardot-Ruffino, Dennis A. Agardy, Lestat R. Ali, James M. Dougan, Li Qiang, Jiao Shen, Chong Zuo, Patrick J. Lenehan, S. Jennifer Wang, Eugena Chang, Joshua Remland, Lauren Brais, Thomas E. Clancy, James M. Cleary, Jason L. Hornick, Brandon M. Huffman, Joseph D. Mancias, George Molina, Mark Fairweather, Jonathan A. Nowak, Kimberly J. Perez, Douglas A. Rubinson, Sarah Slater, Ritchell van Dams, Jiping Wang, Brian M. Wolpin, Lei Zhao, Katharine Barrientos, Ruslan Novosiadly, Miranda Broz, Harshabad Singh, Michael Dougan, Stephanie K. Dougan (通讯作者: Stephanie K. Dougan, DFCI/Harvard)
- Venue / Year: Cancer Cell, 2026 (Vol. 44, pp. 1–20, July 13, 2026)
- Paper: https://doi.org/10.1016/j.ccell.2026.04.005
- Dataset: DFCI 人 PDAC scRNA-seq: dbGAP phs004508, phs004257; 小鼠 scRNA-seq + bulk RNA-seq: GEO GSE325195; 再分析数据集: Loveless et al. (Zenodo), Hwang et al. (GSE202051)
- Scope: 基础研究 / 肿瘤免疫学 / 胰腺癌免疫治疗
- Tags: PDAC, cDC2, CD4+ T cells, IFNγ, STING agonist, anti-CTLA-4, anti-PD-1, triple combination immunotherapy, Th1, dendritic cells, MHC-I independent

## TL;DR

本研究在多种免疫原性差的 PDAC 小鼠模型中，将 STING 激动剂与 anti-PD-1 + anti-CTLA-4 联合使用（三联疗法），实现了持久缓解和免疫记忆。关键发现是肿瘤控制不依赖 CD8+ T 细胞、cDC1 或肿瘤细胞 MHC-I 表达，而依赖 cDC2 在肿瘤引流淋巴结中启动的 IFNγ 产生型 CD4+ T 细胞 (Th1)。人类 PDAC 在化疗前后均保留 cDC2 和 CD4+ T 细胞，且 cDC2 在外周血中的数量约为 cDC1 的 10 倍，提示靶向 cDC2-CD4+ T 细胞-IFNγ 轴可能为 PDAC 提供新的免疫治疗策略。

## 批判性评价

- 论文最核心的贡献在于**范式转换**：挑战了"抗肿瘤免疫必须依赖 CD8+ T 细胞和 cDC1 交叉呈递"的传统框架，证明在免疫原性极差的 PDAC 中，cDC2-CD4+ T 细胞-IFNγ 轴可以独立清除肿瘤。β2m−/− 小鼠（缺乏 MHC-I/CD8+ T 细胞）仍能通过三联疗法治愈肿瘤，这一发现对 MHC-I 下调导致的免疫逃逸具有直接临床意义——约 40-60% 的人类肿瘤存在 MHC-I 下调。
- **从皮下到正位的转化是关键验证**：cDC2 在皮下肿瘤模型中可被 Ly6C+ 细胞功能代偿（Δ1+2+3 小鼠仍可清除皮下肿瘤），但在正位胰腺肿瘤中 cDC2 不可替代。这一组织部位差异增加了结论的生理相关性，但也暴露了皮下模型的局限性——论文大量核心机制实验（尤其是基因敲除小鼠的肿瘤生长曲线）主要依赖皮下模型，正位验证集中在少数关键实验。
- **最大短板是缺乏从机制到临床的桥梁**：三联疗法中使用的是 BMS 的 STING 激动剂 (BMS-986301)，目前供应受限，临床试验尚未成功。论文虽坦诚讨论 STING 临床试验的困难（药物设计差异、给药途径、治疗窗口），但未提供替代性 cDC2 激活策略。人类数据部分（18 例 PDAC scRNA-seq + 38 例 PBMC）证明了 cDC2 和 CD4+ T 细胞在化疗后的存在性，但未证明这些细胞在人体内可被功能性激活。从"小鼠中可行"到"患者中有效"之间仍有巨大距离。
- **IFNγ 的效应机制未完全阐明**：Ifnγr1−/− 肿瘤细胞仍可被三联疗法控制，说明 IFNγ 不直接作用于肿瘤细胞；但嗜酸性粒细胞、中性粒细胞、巨噬细胞 (iNOS)、MAIT/γδ T 细胞均非必须——那么 IFNγ 究竟通过什么下游效应器杀伤肿瘤？论文排除了多个候选通路但未给出正面答案，留下了重要的机制空白。
- 论文 Discussion 提出 anti-CD40 作为潜在替代策略："Activated CD4+ T cells express CD40L, and the success of agonistic anti-CD40 in PDAC models and early-stage clinical trials suggests that activation of CD40 may provide another alternative pathway of tumor rejection" (refs 80-82)。同时指出 "Multiple groups reporting effective anti-tumor immunity in PDAC models linked tumor regression to CD4+ T cells or IFNγ" (refs 28, 83)——即已有独立研究组发现类似通路，但本论文首次系统证明该通路可完全绕过 CD8+ T 细胞/MHC-I。此外，论文坦承未分析 sex/gender/ancestry/race 对结果的影响，这是重要的泛化性限制。

## Research Question

- 研究对象：免疫原性差的胰腺导管腺癌 (PDAC) 的抗肿瘤免疫应答机制
- 小领域范围：肿瘤免疫学中的树突状细胞 (DC) 亚群与 T 细胞启动
- 具体问题：能否通过添加固有免疫激动剂 (STING 激动剂) 将免疫检查点阻断 (ICB) 耐药的 PDAC 转化为响应性肿瘤？如果是，其免疫机制是什么——特别是当 CD8+ T 细胞和 cDC1 交叉呈递不是必须时，哪些细胞和通路替代了传统抗肿瘤免疫？
- 为什么重要：PDAC 五年生存率仅 13%，ICB 仅在约 1% 的 MMRd 肿瘤中有效；MHC-I 下调是原发和获得性 ICB 耐药的主要机制。如果能找到不依赖 CD8+ T 细胞和 MHC-I 的抗肿瘤免疫通路，将为大量 ICB 耐药患者提供新治疗方向
- 论文边界：以小鼠模型为主的机制研究，辅以有限规模的人类 PDAC 样本验证存在性；不涉及临床试验数据

## Motivation and Basic Idea

- Motivation：当前癌症免疫治疗主要靶向 CD8+ T 细胞，依赖 cDC1 的交叉呈递能力。但 PDAC 中 cDC1 极为稀缺，且肿瘤细胞常下调 MHC-I，导致 CD8+ T 细胞无法识别靶标。PDAC 产生大量髓系细胞招募趋化因子 (CXCL1, GM-CSF) 建立高度免疫抑制性 TME，进一步阻碍免疫治疗。
- Basic idea：在免疫检查点阻断 (anti-PD-1 + anti-CTLA-4) 基础上加入 STING 激动剂作为固有免疫佐剂，强力激活树突状细胞，绕过 cDC1/CD8+ T 细胞轴的传统路径，转而利用 cDC2 启动 CD4+ T 细胞 (Th1) 产生 IFNγ 来控制肿瘤。
- 这个 idea 如何回应 motivation：STING 激动剂可诱导强烈的 I 型干扰素应答、增强 DC 的抗原呈递能力和共刺激分子表达。即使 cDC1 稀缺，更丰富的 cDC2 被激活后仍可通过 MHC-II 向 CD4+ T 细胞呈递肿瘤抗原，产生的 IFNγ 可在 TME 中广泛扩散、诱导肿瘤细胞静止和缺血，不依赖 MHC-I。
- 作者给出的证据：(1) 三联疗法在 6694c2 和 6419c5 两种 PDAC 模型中治愈大多数小鼠，包括 β2m−/− 肿瘤；(2) CD4+ T 细胞耗竭完全消除疗效，CD8+ T 细胞耗竭无影响；(3) Batf3−/− 小鼠（缺乏 cDC1）仍可治愈，Δ1+2+3 小鼠（缺乏 cDC2）在正位模型中失败；(4) 人类 PDAC 化疗后仍保留 cDC2 和 CD4+ T 细胞。
- 我的判断：核心逻辑链条清晰——从"PDAC 对 ICB 耐药"到"需要新的免疫激活途径"到"STING 激动剂激活 cDC2→Th1→IFNγ"。但这一路径的发现更多是经验性的（先观察到 CD8+ T 细胞不需要，再反向追踪到 CD4+ T 细胞），而非基于先验假设的定向验证。

## Background

- 背景：PDAC 是免疫治疗最顽固的实体瘤之一，ICB 仅在约 1% 的 MMRd 肿瘤中有效。当前免疫治疗策略（anti-PD-1, anti-CTLA-4）主要依赖 CD8+ T 细胞，而 CD8+ T 细胞的启动需要 cDC1 的交叉呈递。PDAC 中 cDC1 极为稀少，且肿瘤细胞频繁下调 MHC-I。
- 问题：MHC-I 下调导致的 ICB 原发和获得性耐药是一个核心临床问题。即使添加免疫佐剂，如果抗肿瘤免疫仍然依赖 CD8+ T 细胞和 MHC-I，就无法解决这一耐药机制。
- Gap：此前没有系统性研究表明，在 ICB 完全耐药的 PDAC 中，可以通过完全绕过 CD8+ T 细胞/cDC1 轴、利用 cDC2-CD4+ T 细胞通路来实现肿瘤清除。虽然已有零星报道 cDC2 可在某些背景下呈递肿瘤抗原，但在低免疫原性肿瘤中的机制性证据和治疗意义尚未建立。

## Study Design / Assumptions

- 研究类型：基础实验研究（小鼠肿瘤模型 + 基因工程小鼠 + 体内外功能验证），辅以人类 PDAC 样本的描述性分析
- 样本量与人群特征：小鼠实验每组通常 N=5（10 个肿瘤，双侧皮下接种）；人类样本 N=18（scRNA-seq，手术切除 PDAC），N=38（PBMC 流式分析，DFCI protocols #03-189, #14-408）；人类队列以白人为主 (95%)，中位年龄 67 岁，男女各半
- 纳入/排除标准：小鼠使用 6-12 周龄雌性 C57BL/6 背景小鼠（尽可能同窝对照）；人类样本来自 DFCI，接受 FOLFIRINOX、gemcitabine/nab-paclitaxel 或 FOLFOX 化疗，或未经治疗。伦理审批：DFCI IRB (IORG #0000035, FWA #00001121), protocols #03-189 和 #14-408，符合 Declaration of Helsinki 和 US Common Rule。化疗方案分布：FOLFIRINOX 55%, Gem/nab-PTX 16%, FOLFOX 3%, 未治疗 26%。健康对照为 Kraft Blood Donor Center 的去标识化白细胞分离锥
- 主要终点与次要终点：小鼠实验主要终点为肿瘤生长曲线 (AUC 比较) 和治愈率 (day 30-35 无肿瘤)；正位模型为生存期 (Kaplan-Meier) + 正位肿瘤质量 (Day 14 midpoint)；人类数据为免疫细胞组成和频率
- 关键假设与前提条件：(1) 皮下和正位 PDAC 模型的免疫微环境可代表人类 PDAC；(2) 基因敲除小鼠的免疫缺陷不会导致发育性代偿，影响结论；(3) 6694c2 和 6419c5 细胞系的免疫学特征可代表 PDAC 的一般性；(4) 部分实验使用了非标准样本量（如 Batf3-/- 正位 N=8，某些组 N=4 或 N=9/10），实验间变异性需注意
- 不适用的情况：(1) 皮下模型与正位/原位胰腺肿瘤存在显著差异（皮下模型中 cDC2 可被 Ly6C+ 细胞代偿，正位中不行）；(2) 小鼠模型使用 KPC 来源的细胞系，可能无法涵盖 PDAC 的全部异质性；(3) 人类样本量小、以白人为主，限制泛化性

## Method

- 核心思路：(1) 建立三联疗法 (STING 激动剂 + anti-PD-1 + anti-CTLA-4) 在 PDAC 模型中的疗效 → (2) 通过系统性基因敲除/耗竭实验排除法确定必需免疫细胞 → (3) 锁定 cDC2-CD4+ T 细胞-IFNγ 轴 → (4) 用淋巴结 scRNA-seq、流式细胞术、APC-T 细胞共培养验证机制 → (5) 在正位 PDAC 模型中验证 → (6) 用人类 PDAC 样本验证存在性
- 核心思路是怎么想到的：初始目标是测试 STING 激动剂能否克服肿瘤细胞 MHC-I 缺失导致的 ICB 耐药（β2m−/− 模型）。意外发现三联疗法在 β2m−/− 肿瘤中同样有效，由此引出"不依赖 CD8+ T 细胞的抗肿瘤免疫"这一核心发现
- 从 motivation 到 method 的逻辑链：PDAC 对 ICB 耐药 → 添加 STING 激动剂作为免疫佐剂 → 发现三联疗法可治愈 PDAC → β2m−/− 肿瘤同样有效（排除 MHC-I/CD8+ T 细胞）→ 系统性耗竭/敲除：NK 细胞不需要、Rag2−/− 失败（需要适应性免疫）、CD4+ T 细胞必须、CD8+ T 细胞不需要 → IFNγ−/− 和 Tbx21−/− 失败（需要 Th1/IFNγ）→ FTY720 阻断淋巴结输出（需要 LN 启动）→ cDC2 富集肿瘤抗原并激活（流式+scRNA-seq）→ APC-T 共培养证实 cDC2 启动 CD4+ T 细胞 → Batf3−/− 有效（cDC1 不需要）、Δ1+2+3 正位失败（cDC2 必须）→ 人类 PDAC 验证 cDC2 和 CD4+ T 细胞的存在
- 关键设计取舍：(1) 使用双侧皮下肿瘤模型+单侧 IT STING 注射，可同时评估局部和全身效应；(2) 选择 BMS-986301 (非核苷酸类小分子 STING 激动剂) 而非 ADU-S100 等环二核苷酸类，因前者在肿瘤微环境中更稳定；(3) 使用 ZsGreen+ 肿瘤细胞追踪肿瘤抗原在 DC 中的摄取；(4) 使用 6694c2COVA (卵清蛋白表达) 肿瘤配合 OT-II 转基因 T 细胞进行抗原特异性验证
- 为什么不是更直接/更简单的方案：直接使用正位模型更接近临床但技术难度更高（需要手术植入胰腺），且肿瘤生长监测不如皮下直观。论文采用皮下模型做主要机制探索、正位模型做关键验证的策略是合理的折中
- 系统流程或算法步骤：
  1. 双侧皮下接种 6694c2/6419c5 PDAC 细胞 (250,000 cells/侧)
  2. Day 7: 一侧肿瘤 IT 注射 STING 激动剂 (BMS-986301, 100 μg)；IP anti-PD-1 (10 mg/kg) + anti-CTLA-4 (10 mg/kg)
  3. Day 14, 21, 28: 重复 IP anti-PD-1 + anti-CTLA-4 (共 4 剂)
  4. 每 2-3 天测量双侧肿瘤体积
  5. 系统性免疫细胞耗竭/基因敲除排除法（anti-NK1.1, anti-CD8, anti-CD4, β2m−/−, Rag2−/−, Tcrα−/−, μMT−/−, Ifnγ−/−, Tbx21−/−, Perforin−/−, etc.）
  6. 肿瘤引流淋巴结流式细胞术分析 DC 亚群 (CD11c, Sirpα, XCR1, CD80, MHC-II, ZsGreen)
  7. 肿瘤引流淋巴结 scRNA-seq (10x Genomics, Seurat v4.3/v5.3, Harmony 整合)
  8. APC-T 细胞共培养 (FACS 分选 B cells/cDC1/cDC2 + OT-II/TRP1high T cells)
  9. FTY720 阻断淋巴结淋巴细胞输出 (75 μg/day 口服灌胃)
  10. 正位胰腺肿瘤模型 (同日手术：皮下接种 250,000 cells 于右 flank + 胰腺内注入 50,000 cells in Matrigel)
  11. 转移模型 (6694c2-met, 背侧皮下接种 180,000 cells 后手术切除)
  12. Bulk RNA-seq (STING 激动剂/IFNγ 处理肿瘤细胞, STAR alignment, DESeq2)
  13. CRISPR-Cas9 肿瘤细胞基因敲除 (Ciita, Ifnγr1, Stat1, Caspase-8, β2m)
  14. 人类 PDAC scRNA-seq (10x Genomics, Seurat)
  15. 人类 PBMC 流式分析 (化疗前后 cDC1/cDC2 频率)
  16. 公开数据集再分析 (Loveless et al., Hwang et al.)
- 关键定义/公式/不变量：
  - 三联疗法 (Triple combination therapy) = STING 激动剂 (IT, 单次) + anti-PD-1 (IP, 每周) + anti-CTLA-4 (IP, 每周)
  - 治愈率 (Cure rate) = Day 30-35 无肿瘤的小鼠比例
  - cDC1 = CD11c+ XCR1+ Sirpα− CD8α+ MHC-II+（经典 1 型树突状细胞，交叉呈递能力最强）
  - cDC2 = CD11c+ XCR1− Sirpα+ CD11b+ MHC-II+（经典 2 型树突状细胞，MHC-II 呈递为主）
  - Th1 = T-bet+ IFNγ+ CD4+ T 细胞（1 型辅助 T 细胞）
  - bi-tumor model = 双侧皮下接种，单侧 IT 注射 STING，评估注射侧 (injected) 和对侧 (contralateral) 肿瘤
- 实现细节：STING 激动剂 BMS-986301 为 Bristol Myers Squibb 提供的非核苷酸类小分子，体外浓度 225 μg/mL (bulk RNA-seq 实验)；anti-PD-1 (RMP1-14) 和 anti-CTLA-4 (9D9) 均来自 Bristol Myers Squibb；scRNA-seq 使用 10x Genomics Chromium X 平台 (Single Cell K Chip PN-2000182, Chromium Next GEM Single Cell 5' GEM Kit v2)，测序 Illumina NovaSeq 6000 2×150bp (Azenta Life Sciences)，数据分析使用 Cellranger v7.0.0 → Seurat v4.3.0 (DFCI 人样本) / v5.3.0 (published dataset) → Harmony v1.2.3 整合 → DropletUtils v1.18.1 (empty droplet 排除 FDR<0.01)；Bulk RNA-seq 使用 STAR v2.7.9a + Rsubread + DESeq2

## Evaluation

- 实验思路：采用"排除法"策略，通过系统性耗竭或基因敲除逐一排除候选免疫细胞和分子，最终锁定 cDC2-CD4+ T 细胞-IFNγ 轴。辅以正位模型和人类样本验证转化潜力。
- 评估指标：肿瘤生长曲线 AUC 的 t 检验 + Wilcoxon matched-pairs signed rank test + one-way ANOVA + Pearson correlation；治愈率 (Fisher exact test)；Kaplan-Meier 生存分析 (Log-rank test)；Rechallenge 实验使用 Bonferroni correction (α = 0.017)；流式细胞术定量 DC 亚群频率和激活状态 (Wilcoxon rank-sum test)；ELISpot (IFNγ spot 数)；scRNA-seq 细胞组成差异。统计软件为 GraphPad Prism v10
- 主要结果：
  - 三联疗法在 6694c2 中治愈率 5/5 (皮下)、6694c2 β2m−/− 中有两组数据：第一组 5/5 治愈，第二组合并实验 3/10 治愈 (皮下)；6419c5 中同样有效 (WT 4/5 治愈)
  - CD4+ T 细胞耗竭完全消除疗效 (0/5 治愈)，CD8+ T 细胞耗竭后仍有部分治愈：6694c2 anti-CD8 组 3/5 治愈（对照 WT 5/5），6419c5 anti-CD8 组 3/5 治愈（对照 WT 4/5），总体不影响结论但治愈率有所下降
  - Ifnγ−/− 和 Tbx21−/− 小鼠完全无法控制肿瘤 (0/5 治愈)
  - Batf3−/− 小鼠 (缺乏 cDC1) 可治愈皮下和正位 (N=8，非标准 N=5) 肿瘤；Δ1+2+3 小鼠 (缺乏 cDC2) 可控制皮下肿瘤（皮下精确治愈率：一组 5/5 WT + 5/5 Δ1+2+3，另一组 4/5 WT + 4/5 Δ1+2+3）但正位肿瘤控制失败
  - FTY720 阻断 LN 输出后，对侧肿瘤控制显著消失 (p=0.0023)，但注射侧肿瘤控制仅部分减弱 (p=0.17, 不显著)，提示注射侧可能存在局部 priming 代偿机制
  - 三联疗法后 48h，tdLN 中 cDC2:cDC1 比例显著升高（p<0.0001，从约 5:1 升至约 15-20:1），cDC2 的 CD80+ 比例从 22.0% 飙升至 90.2% 和 ZsGreen+ (肿瘤抗原) 比例从 2.30% 升至 28.3% 均大幅增加。Migratory cDC2 比例从 62.7% 升至 83.8%（resident cDC2 从 35.3% 降至 15.0%），表明三联疗法主要扩增了 migratory cDC2 亚群。值得注意的是，cDC1 的 ZsGreen+ 比例在皮下 tdLN 中变化不显著 (p=0.8208)，但在正位胰腺 tdLN 中显著增加 (p=0.0035)，提示不同组织部位中 cDC1 的抗原摄取能力存在差异
  - APC-T 共培养：cDC2 对 OT-II (CD4+) T 细胞的激活能力最强，且为抗原特异性
  - 正位模型：三联疗法显著延长生存期（WT vehicle vs triple: p=0.0020；β2m−/− vehicle vs triple: p=0.0019；anti-CD4 耗竭消除生存获益 p=0.6568 即 treatment vs vehicle 无差异；CD8+ T 细胞耗竭无影响 p=0.0019；Ifnγ−/− 无生存获益 p=0.3211）。正位肿瘤质量在 Day 14 midpoint 也显著缩小 (p=0.0002)。正位胰腺 tdLN 中 CD80+ cDC2s 显著增加 (p<0.0001, 从~20%升至~75%)，但 ZsGreen+ cDC2s 变化不显著 (p=0.1846)，与皮下 tdLN 中 ZsGreen+ 显著增加形成对比
  - 人类 PDAC (N=18 scRNA-seq, N=38 demographics/PBMC)：化疗前后 CD4+ T 细胞和 cDC2 频率无显著变化；外周血中 cDC2:cDC1 ≈ 10:1
  - CD1C (cDC2 标志物) 高表达与 PDAC 患者改善生存相关 (Posta & Gyorffy 数据集)，CLEC9A (cDC1) 无关联
  - 转移模型中 STING 激动剂注射阻止了术后转移发生 (0/N vs 多数对照组)
  - Type I IFN 不需要：Ifnar1−/− 小鼠对三联疗法仍有反应 (3/5 治愈)，cDC2 积累和激活不受影响
  - 延迟治疗实验：即使延迟至 Day 14 开始治疗（肿瘤平均 200 mm³），三联疗法仍实现 7/7 小鼠治愈（对照组 Day 7 开始也是 7/7），证明疗效不是在肿瘤极小时的"预防性"效应 (Figure S1A)
  - Rechallenge 实验详细数据：Naive isotype n=33，αCD4 n=20，αCD8 n=19。CD8+ 耗竭后再挑战小鼠仍大部分受保护，CD4+ 耗竭后保护完全消失 (p<0.0001)，证明免疫记忆完全依赖 CD4+ T 细胞 (Figure 1J, Figure S2H)

## Key Artifacts

- 关键图：
  - Figure 1: 三联疗法在多种基因敲除/耗竭模型中的肿瘤生长曲线——核心发现的全景图：CD8+ T 细胞不需要 (D-F)、CD4+ T 细胞必须 (G-I)、免疫记忆依赖 CD4+ T 细胞 (J)
  - Figure 2: IFNγ 和 Th1 (T-bet) 是肿瘤控制的必要条件——Ifnγ−/− (F-G)、anti-IFNγ (H)、Tbx21−/− (I) 均失败；流式和 ELISpot 证实 Th1 应答
  - Figure 3: cDC2 在 tdLN 中富集肿瘤抗原并激活——流式显示 CD80+ ZsGreen+ cDC2 大幅增加 (C-G)，包括 migratory cDC2 比例从 62.7% 升至 83.8%；scRNA-seq 确认 DC 亚群变化 (H-I)；FTY720 证实 LN 启动的必要性 (A)，对侧肿瘤控制显著消失 (p=0.0023) 但注射侧部分代偿 (p=0.17)
  - Figure 4: 正位 PDAC 模型复制 CD4+ T 细胞/IFNγ 依赖性——正位肿瘤控制 (B)、生存获益 (C-E)（多组 p 值详见 Evaluation 部分）、胰腺 tdLN 中 cDC2 激活 (G-J)。注意：胰腺 tdLN 中 ZsGreen+ cDC2s 变化不显著 (p=0.1846)，与皮下 tdLN 中 ZsGreen+ 显著增加形成对比，提示不同组织部位抗原摄取效率差异
  - Figure 5: cDC2 启动 CD4+ T 细胞的直接证据和 cDC2 的必要性——APC-T 共培养 (A-E)；Batf3−/− 有效/Δ1+2+3 正位失败 (F-I)；CD11ccre MHC-IIfl/fl 失败 (G) 但 LysMcre MHC-IIfl/fl 有效 (H)
  - Figure 6: 人类 PDAC 中 CD4+ T 细胞在化疗前后持续存在——scRNA-seq UMAP (A)、CD4+ T 亚群分析 (B-D)、频率无变化 (E-G)、差异表达 (H)
  - Figure 7: 人类 PDAC 中 cDC2 丰富且在化疗后保留——Loveless 数据再分析 (A-C)、Hwang 数据再分析 (D-F)、DFCI 队列 (G-K)、CD1C 与生存 (L)
- 关键表：
  - Table 1: 患者队列人口统计学特征 (N=38)
  - Table S1: 所有体内肿瘤生长曲线实验的治愈率汇总——关键参考表，汇总了 30+ 行数据（含多个实验批次重复，部分基因型有多组数据如 β2m−/− 的 5/5 和 3/10）的治愈率
  - Table S2: 患者详细特征 (PAN 编号、化疗方案、分期、采血时间、性别、种族、年龄、糖尿病状态)
- 关键公式/定义：
  - 肿瘤体积 = 三维测量乘积 (长 × 宽 × 高)
  - 统计方法：AUC (area under curve) 比较 + t test；Kaplan-Meier + Log-rank test + Bonferroni 校正
- 这些证据分别支撑哪些结论：
  - Figure 1D-F → CD8+ T 细胞和 MHC-I 不需要（核心反直觉发现）
  - Figure 1G-I → CD4+ T 细胞必须（确立新通路）
  - Figure 2F-I → IFNγ 和 T-bet/Th1 是效应分子和分化程序
  - Figure 3C-G → cDC2 是抗原呈递细胞（摄取肿瘤抗原、表达 CD80、在 LN 中积累）
  - Figure 5A-E → cDC2 直接启动 CD4+ T 细胞（共培养实验的直接证据）
  - Figure 5F-I → cDC2 在正位模型中不可替代（cDC1 可缺、cDC2 不可缺）
  - Figure 6-7 → 人类 PDAC 中存在转化基础（cDC2 和 CD4+ T 细胞在化疗后保留）

## Findings

- 发现 1：三联疗法 (STING 激动剂 + anti-PD-1 + anti-CTLA-4) 可在多种免疫原性差的 PDAC 模型中实现持久缓解和免疫记忆，且这一过程完全不依赖 CD8+ T 细胞、cDC1 和肿瘤细胞 MHC-I/MHC-II 表达。这打破了"抗肿瘤免疫 = CD8+ T 细胞 + cDC1 交叉呈递"的传统范式。
- 发现 2：cDC2 是三联疗法中启动抗肿瘤 CD4+ T 细胞 (Th1) 的关键抗原呈递细胞。cDC2 在 tdLN 中富集肿瘤抗原 (ZsGreen+)、上调 CD80（从 22.0% 升至 90.2%）、通过 MHC-II 启动 CD4+ T 细胞。在正位 PDAC 模型中，cDC2 不可替代（Δ1+2+3 小鼠失败），但在皮下模型中可被 Ly6C+ 细胞部分代偿（Δ1+2+3 皮下仍可治愈 5/5 或 4/5）。原文推测："We hypothesize that a Ly6C+ cell may functionally compensate for cDC2s in the subcutaneous setting"。这种组织部位依赖性差异（皮下 vs 正位/胰腺）既是结论的局限性（大量核心排除法实验依赖皮下模型），也增加了生理相关性（正位验证的严格性）。
- 发现 3：人类 PDAC 在化疗前后均保留 cDC2 和 CD4+ T 细胞，且 cDC2 在外周血中的数量约为 cDC1 的 10 倍。cDC2 标志物 CD1C 的高表达与 PDAC 患者改善生存相关，而 cDC1 标志物 CLEC9A 无此关联。这为靶向 cDC2-CD4+ T 细胞轴的转化策略提供了存在性基础和初步临床关联证据。

## Strengths

- 论文最有说服力的地方：系统性排除法的严谨性——通过超过 15 种基因敲除/耗竭模型（β2m−/−, Rag2−/−, Tcrα−/−, μMT−/−, Batf3−/−, Δ1+2+3, Ifnγ−/−, Tbx21−/−, Perforin−/−, Ifnar1−/−, Ccr2−/−, iNOS−/−, ΔΔGata1, CD11ccre MHC-IIfl/fl, LysMcre MHC-IIfl/fl 等）逐层排除，逻辑链条清晰，结论稳健。每种关键结论都在 2 个以上独立模型中验证（6694c2 + 6419c5，皮下 + 正位）。
- 方法、数据、实验或问题设定的优势：(1) 双侧皮下肿瘤模型的设计巧妙——单侧 IT STING 注射可同时评估局部（注射侧）和全身（对侧）效应；(2) 6694c2COVA + OT-II 共培养系统提供了抗原特异性的直接证据，共培养前使用 CD90.2 阳性选择去除 T 细胞（保留 APC），避免了 APC 损失，方法学上优于阴性选择策略；(3) FTY720 实验优雅地区分了 LN 启动和局部启动的贡献，且注射侧 vs 对侧的差异分析增加了结论精度；(4) 正位模型增加了生理相关性；(5) 三个独立人类 PDAC 数据集（DFCI 自有 + Loveless + Hwang）的交叉验证增加了可信度；(6) 延迟治疗实验（Day 14 开始，肿瘤 200 mm³ 仍治愈 7/7）证明疗效不依赖早期干预
- 相比已有工作的有效推进：(1) 首次证明在 ICB 完全耐药的 PDAC 中可通过 cDC2-CD4+ T 细胞-IFNγ 轴实现肿瘤清除，且该路径不依赖 MHC-I；(2) 首次在正位 PDAC 模型中直接比较 cDC1 vs cDC2 的必要性；(3) 首次报道人类 PDAC 化疗前后 cDC2 和 CD4+ T 细胞的系统性定量分析。

## Limitations

- 研究设计、假设或适用范围的限制：(1) 以小鼠模型为主的临床前研究，三联疗法（特别是 STING 激动剂）在人类 PDAC 中的疗效尚未验证；(2) 人类样本量小（scRNA-seq N=18，PBMC N=38），且 95% 为白人，限制泛化性；(3) 6694c2 和 6419c5 均来自 KPC 小鼠模型，可能无法涵盖 PDAC 的全部分子亚型和免疫表型；(4) 仅使用了一种 STING 激动剂 (BMS-986301)，且该药物目前供应受限；(5) 论文坦承未分析 sex, gender, ancestry, race 对结果的影响："Analyses of how sex, gender, ancestry, race, ethnicity, and socioeconomic status affected our results were not performed, and thus limit the generalizability of the results" (Ethics statement)；(6) 部分实验间治愈率波动较大（如 β2m−/− 的 5/5 vs 3/10），排除法策略对实验间一致性要求高
- 数据集、baseline、metric、ablation 或复现性的不足：(1) 缺乏与现有 PDAC 免疫治疗策略（如 anti-CD40、KRAS 疫苗、CD73 抑制剂等）的头对头比较；(2) IFNγ 的下游效应机制未阐明——排除了嗜酸性粒细胞、中性粒细胞、巨噬细胞 iNOS、MAIT/γδ T 细胞后，仍不清楚 IFNγ 通过什么具体效应器杀伤肿瘤；(3) 肿瘤抗原的特异性未深入鉴定——OVA 模型证明了概念但未识别内源性肿瘤新抗原；(4) scRNA-seq 样本量有限，化疗前后比较未经多重检验校正后仍保持阴性，可能存在统计效力不足
- 在真实场景中可能失效的条件：(1) STING 激动剂的临床转化面临药物设计差异、给药途径（IT 注射在临床操作中困难）、治疗窗口窄等挑战；(2) 人类 PDAC 的 TME 比小鼠模型更复杂（更丰富的纤维化基质、更多的免疫抑制细胞），cDC2 激活可能受到更多制约；(3) 化疗可能改变 DC 和 T 细胞的功能状态（不仅仅是频率），论文未评估功能变化；(4) 小鼠模型的"治愈"结果在人类中极难复现——即使是最成功的 PDAC 免疫治疗（anti-CD40 + 化疗）在临床中也仅见有限的客观缓解率

## My Takeaways

- 对自身研究或学习的启发：这篇论文展示了"阴性结果如何催生重要发现"——最初测试 STING 激动剂能否克服 MHC-I 缺失，发现 β2m−/− 肿瘤同样有效，由此引出 CD8+ T 细胞不需要的意外结论。这种"意外发现→系统性验证→范式转换"的研究路径值得学习。同时，论文的排除法策略（15+ 种 KO/耗竭模型）是免疫学机制研究的经典范式，展示了如何在不预设结论的情况下通过系统性排除逼近真相。
- 可复用的方法或思路：(1) 双侧肿瘤模型 + 单侧 IT 给药的设计，用于区分局部和全身免疫效应；(2) ZsGreen+ 肿瘤细胞追踪抗原在 DC 中的摄取——简单有效的抗原呈递评估工具；(3) APC-T 共培养系统（FACS 分选 DC 亚群 + 转基因 T 细胞）用于直接验证抗原呈递功能；(4) 系统性排除法策略在免疫机制研究中的模板价值
- 可能的后续问题：(1) IFNγ 在不直接作用于肿瘤细胞 (Ifnγr1−/− 肿瘤仍可被控制) 且不依赖嗜酸性粒细胞/中性粒细胞/巨噬细胞 iNOS 的情况下，通过什么效应机制清除肿瘤？是否存在尚未被排除的效应器？(2) 人类 PDAC 中的 cDC2 能否被临床可用的佐剂（如 TLR 激动剂、CpG 等）功能性激活？(3) cDC2-CD4+ T 细胞轴是否可以与现有化疗/靶向治疗联合？(4) 皮下模型中 Ly6C+ 细胞代偿 cDC2 的机制是什么？这种代偿能否被治疗性利用？

## Related Papers

- 前置阅读：Hwang et al. 2022 (Nat Genet) — PDAC snRNA-seq + 空间转录组（本论文再分析了其数据）；Loveless et al. 2025 (Clin Cancer Res) — PDAC 髓系细胞图谱（本论文再分析了其数据）；Binnewies et al. 2019 (Cell, ref 44) — cDC2 在肿瘤免疫中的角色和 PD-1 阻断的关系；Lin et al. 2020 (JEM, ref 46) — DC 亚群与 T 细胞启动的机制研究
- 后续阅读：关注 STING 激动剂在 PDAC 中的临床试验进展；anti-CD40 在 PDAC 中的临床数据（论文 refs 80-82，具体作者需核实——原文 Discussion 引用了 anti-CD40 在 PDAC 中的成功，但注意"O'Hara et al., Nature 2021"和"Beatty et al., Science 2011"不在本论文参考文献列表中，为笔记作者推测性引用）；CD4+ T 细胞在肿瘤免疫中的其他新兴证据
- 可对比论文：与本论文同刊的 ctPANDA 研究 (Tang et al., Cancer Cell 2026) — 从 snRNA-seq 预后图谱角度研究 PDAC，两者互补但方法学路径完全不同
- 最接近的相关工作：(1) anti-CD40 + 化疗在 PDAC 中的临床前/临床研究（论文 refs 80-82，需核实具体引用）——同样靶向 CD4+ T 细胞活化通路。论文 Discussion 原文："Activated CD4+ T cells express CD40L, and the success of agonistic anti-CD40 in PDAC models and early-stage clinical trials suggests that activation of CD40 may provide another alternative pathway of tumor rejection"；(2) 肿瘤疫苗诱导 CD4+ T 细胞应答的临床试验 (Hilf et al., Nature 2019; Keskin et al., Nature 2019)；(3) 论文 Discussion 指出："Multiple groups reporting effective anti-tumor immunity in PDAC models linked tumor regression to CD4+ T cells or IFNγ" (refs 28, 83)——即已有其他研究组独立发现了类似的 CD4+ T 细胞/IFNγ 依赖性通路，但本论文首次系统证明该通路可完全绕过 CD8+ T 细胞/MHC-I
- 关键差异：本研究的核心创新在于证明 cDC2-CD4+ T 细胞-IFNγ 轴可以完全绕过 CD8+ T 细胞/MHC-I 实现肿瘤清除，而非仅作为 CD8+ T 细胞的"辅助"

## Open Questions

- IFNγ 的最终效应机制是什么？排除了 Ifnγr1 肿瘤内在信号、嗜酸性粒细胞、中性粒细胞、巨噬细胞 iNOS、MAIT/γδ T 细胞后，谁在执行杀伤？
- 人类 PDAC 中能否通过临床可用的免疫佐剂（非 STING 激动剂）激活 cDC2-CD4+ T 细胞轴？TLR 激动剂、CpG、poly(I:C) 等是否具有类似效应？
- 皮下模型中 Ly6C+ 细胞代偿 cDC2 的身份和功能是什么？这种代偿在正位胰腺微环境中为何不可行？
- 三联疗法诱导的免疫记忆能持续多久？CD4+ T 细胞记忆的维持是否需要持续的抗原刺激？
- cDC2-CD4+ T 细胞轴在 PDAC 以外的免疫原性差的实体瘤（如微卫星稳定型结直肠癌、前列腺癌）中是否同样可被利用？
- 化疗后的 cDC2 和 CD4+ T 细胞功能是否完好？论文仅证明了"存在"，未证明"可激活"。
- 论文 Discussion 提出的重要假说："Why endogenously generated CD8+ T cell responses have thus far been insufficient for durable clinical benefit is unclear. One possibility is that antigens are inadequate for tumor rejection"——即内源性 CD8+ T 细胞在 PDAC 中不足，是否因为肿瘤抗原质量（而非数量）不足以引发有效反应？这对理解 PDAC 免疫逃逸有深远意义

---

## 方法学背景与技术体系详解

### 1. STING 通路与 STING 激动剂

STING (Stimulator of Interferon Genes, TMEM173) 是 cGAS-STING DNA 感知通路的关键下游效应分子。当细胞质中出现双链 DNA（如肿瘤 DNA）时，cGAS 催化合成 cGAMP，激活 STING，后者从内质网转移到高尔基体，招募 TBK1 和 IRF3，最终诱导 I 型干扰素 (IFNα/β) 和 NF-κB 依赖性炎症因子的表达。STING 激动剂可强力激活 DC，增强抗原呈递和共刺激分子表达，因此被视为免疫佐剂候选物。

本论文使用的 BMS-986301 是 Bristol Myers Squibb 开发的非核苷酸类小分子 STING 激动剂 (Cherney et al., J Med Chem 2022)，通过化学型杂交策略发现，比环二核苷酸类 (如 ADU-S100/MIW815) 具有更好的药代动力学特性和肿瘤微环境稳定性。给药方式为单次 IT 注射 100 μg，血清 IFNα 在 4 小时达峰后快速下降。值得注意的是，论文证明 type I IFN 并非疗效所必须 (Ifnar1−/− 小鼠仍有效)，提示 STING 激动剂的作用可能通过非 IFNAR 依赖的途径（如直接 DC 激活、NF-κB 通路）实现。

STING 激动剂的临床试验尚未成功，主要原因包括：药物设计差异大、给药途径困难（IT 注射在临床中的可行性）、治疗窗口窄、全身给药的毒性等。论文坦承这些挑战并指出 STING 激动剂仅是激活 cDC2 的一种工具，其他固有免疫佐剂可能具有类似效果。

### 2. 免疫检查点阻断 (anti-PD-1 + anti-CTLA-4)

Anti-PD-1 (RMP1-14) 和 anti-CTLA-4 (9D9) 是两种最常用的免疫检查点阻断抗体。Anti-PD-1 通过阻断 PD-1/PD-L1 相互作用，恢复耗竭 T 细胞的功能，特别是促进 TCF1+ 前体耗竭 T 细胞的更新。Anti-CTLA-4 通过阻断 CTLA-4 与 CD80/86 的竞争，增强 T 细胞的共刺激信号，在小鼠中还可通过 ADCC 耗竭 Tregs。

在 PDAC 模型中，dual ICB 单用无效——这正是 PDAC 被称为"ICB 耐药"的原因。本论文中，dual ICB 或 STING 激动剂单用均无法控制肿瘤，但三联疗法实现了治愈。这一结果表明，STING 激动剂提供的 DC 激活信号是将 ICB 从无效转化为有效的关键"开关"。给药方案：IP 10 mg/kg，每周一次，共 4 剂。

### 3. 基因敲除小鼠模型的免疫学意义

论文使用了大量基因敲除小鼠来系统性排除免疫细胞亚群的必要性，每个模型都有特定的免疫学含义：

- **Batf3−/−**: BATF3 是 cDC1 发育所必须的转录因子。Batf3−/− 小鼠缺乏 cDC1 但保留 cDC2。用于证明 cDC1（及其交叉呈递能力）不需要。
- **Δ1+2+3 (Irf8fl/fl Zbtb46cre)**: 缺乏 cDC2 但保留 cDC1。用于证明 cDC2 的必要性。本论文发现 Δ1+2+3 在皮下模型中仍有效（被 Ly6C+ 细胞代偿），但在正位模型中失败。
- **β2m−/−**: 缺乏 β2 微球蛋白，因此无法表达 MHC-I 和常规 CD8+ T 细胞。用于证明 MHC-I/CD8+ T 细胞不需要。
- **I-Ab−/−**: 缺乏 MHC-II (I-Ab)。用于证明 MHC-II 呈递是必须的（CD4+ T 细胞需要 MHC-II）。
- **Rag2−/−**: 缺乏重组激活基因 2，无成熟 B 和 T 细胞。用于证明适应性免疫的必要性。
- **Tcrα−/−**: 缺乏 αβ T 细胞。用于确认 αβ T 细胞（而非 γδ T 细胞）是必需的。
- **Ifnγ−/−**: 缺乏 IFNγ。用于证明 IFNγ 是必需的效应分子。
- **Tbx21−/− (T-bet−/−)**: 缺乏 T-bet 转录因子，Th1 分化受阻。用于证明 Th1 程序（而非其他 CD4+ T 细胞亚群）是必需的。
- **Ifnar1−/−**: 缺乏 I 型 IFN 受体。用于排除 type I IFN 的必要性。
- **Ccr2−/−**: 缺乏 CCR2，单细胞来源巨噬细胞减少。用于排除单核细胞/巨噬细胞的必要性。
- **CD11ccre MHC-IIfl/fl**: DC 特异性 MHC-II 敲除。用于证明 DC 的 MHC-II（而非其他 APC 的 MHC-II）是必需的。
- **LysMcre MHC-IIfl/fl**: 巨噬细胞特异性 MHC-II 敲除。用于证明巨噬细胞 MHC-II 不需要（阴性对照）。
- **Perforin−/−**: 缺乏穿孔素，细胞毒性颗粒途径受损。用于排除穿孔素介导的杀伤。
- **μMT−/−**: B 细胞发育受阻。用于排除 B 细胞的必要性。

### 4. 流式细胞术分析 DC 亚群

DC 亚群的鉴定依赖多色流式面板：

- **cDC1**: CD45+ → 单细胞 → F4/80− Ly6C− → CD11c+ → XCR1+ Sirpα− → MHC-II+ CD8α+
- **cDC2**: CD45+ → 单细胞 → F4/80− Ly6C− → CD11c+ → XCR1− Sirpα+ → MHC-II+ CD11b+
- **激活标志物**: CD80 (共刺激分子)
- **肿瘤抗原摄取**: ZsGreen+ (来自 ZsGreen 标记的肿瘤细胞)

关键发现：三联疗法后 cDC2 的 CD80+ 比例从约 22% 升至约 90%，ZsGreen+ 比例从约 2% 升至约 28%。cDC1 的 CD80 也上升但不携带肿瘤抗原。cDC2:cDC1 比例从约 5:1 升至约 20:1。

### 5. scRNA-seq 与数据分析

小鼠 tdLN scRNA-seq: 治疗后 48h 收获 tdLN，分选 ZsGreen+/ZsGreen− 免疫细胞，10x Genomics Chromium X 平台建库。数据分析流程：Cellranger v7.0.0 → Seurat v4.3/v5.3 (QC、标准化、降维、聚类) → Harmony v1.2.3 (批次校正整合) → DropletUtils (barcode swapping 去除)。

人类 PDAC scRNA-seq: 手术切除标本，10x Genomics 平台。Seurat 分析，亚聚类 CD4+ T 细胞和髓系/DC 群体。

公开数据集再分析: Loveless et al. (Zenodo) 和 Hwang et al. (GSE202051) 的数据，使用相同的 Seurat 流程进行再分析以验证 DC 亚群组成。

### 6. CRISPR-Cas9 肿瘤细胞工程

论文使用 CRISPR-Cas9 对 6694c2 肿瘤细胞进行多种基因敲除，以排除肿瘤细胞内在信号通路的影响：

- **Ciita−/−**: 消除 IFN 诱导的 MHC-II 表达 → 证明 CD4+ T 细胞不通过直接识别肿瘤 MHC-II 杀伤
- **Ifnγr1−/−**: 消除肿瘤细胞对 IFNγ 的响应 → 证明 IFNγ 不直接作用于肿瘤细胞
- **Stat1−/−**: 消除 IFN 信号传导 → 进一步确认肿瘤细胞内在 IFN 信号不需要
- **Caspase-8−/−**: 消除外源性凋亡途径 → 排除死亡受体途径
- **β2m−/−**: 消除 MHC-I 表达 → 核心实验模型

基因编辑工具：lentiCRISPRv2 (慢病毒转导 + puromycin 筛选) 或 px459 (脂质体转染 + puromycin 筛选)。敲除效率通过 Western blot 或流式细胞术验证。

### 7. APC-T 细胞共培养系统

这是论文中验证 cDC2 启动 CD4+ T 细胞的直接功能实验：

- 使用 6694c2COVA 肿瘤 (表达卵清蛋白) 接种小鼠
- 三联疗法后 48h 收获 tdLN
- CD90.2 阳性选择去除 T 细胞（保留 APC）
- FACS 分选三群 APC：B cells, cDC1, cDC2
- 与 OT-II CD4+ T 细胞 (识别 OVA323-339/MHC-II) 或 TRP1high CD8+ T 细胞 (识别 Tyrp1/MHC-I，阴性对照) 共培养 48h
- 流式检测 T 细胞激活标志物 (CD69, CD25, CD44, PD-1)
- 关键结果：cDC2 最有效地激活 OT-II T 细胞，且为抗原特异性（TRP1high T 细胞不被激活）

### 8. 人类 PDAC 样本分析

- **scRNA-seq**: 18 例手术切除 PDAC (DFCI protocols #03-189, #14-408)，包括治疗初治和化疗后标本。10x Genomics Chromium 平台，Seurat 分析。
- **PBMC 流式分析**: 38 例 PDAC 患者外周血，化疗前后配对样本。DC 面板：HLA-DR, CD123 (pDC), CD1c (cDC2), CADM1 (cDC1), CD34, CD20, CD3, CD14, CD16, CD19。
- **生存分析**: 使用 Posta & Gyorffy 在线工具评估 CD1C (cDC2) 和 CLEC9A (cDC1) 表达与 PDAC 患者生存的关联。

---

## 补充材料分析

### 补充表格

- **Table S1**: 所有体内肿瘤生长曲线实验的治愈率汇总（约 30 组），涵盖所有基因敲除/耗竭模型。是快速查阅每个实验组治愈/未治愈鼠数的关键参考表。
- **Table S2**: 38 例患者的详细人口学和临床特征，包括 PAN 编号、化疗方案（FOLFIRINOX/gemcitabine/nab-paclitaxel/FOLFOX/无）、分期（局部/转移）、采血时间点、性别、种族、年龄、糖尿病状态、肝转移状态。患者以白人为主 (95%)，中位年龄 67 岁，男女各半，约 1/3 有糖尿病，约 1/3 为转移性疾病。

### 补充图

- **Figure S1**: (A) 延迟治疗（Day 14 开始，肿瘤平均 200 mm³）仍然有效——证明三联疗法不是在肿瘤极小时"预防性"起效。(B-D) 6694c2-met 转移模型：STING 激动剂注射阻止术后转移（0/N 对照组多数发生转移）——证明治疗可抑制远处转移。(E) STING 激动剂对 6694c2 肿瘤细胞无直接毒性（体外高浓度处理不影响生长动力学）。(F) Bulk RNA-seq 显示 6694c2 对 STING 激动剂的 IFN 应答极弱（与 B16F10 对比），排除肿瘤细胞内在效应。
- **Figure S2**: (A-B) Rag2−/− 和 Tcrα−/− 小鼠对三联疗法无应答——适应性免疫（αβ T 细胞）必须。(C) μMT−/− 小鼠有效——B 细胞不需要。(D-F) Perforin−/−、TNFα 中和、Caspase-8−/− 肿瘤均有效——排除细胞毒性和外源性凋亡途径。(G) Ciita−/− 肿瘤有效——CD4+ T 细胞不通过识别肿瘤 MHC-II 杀伤。(H) β2m−/− 治愈小鼠的免疫记忆：CD8+ T 细胞耗竭后仍能保护，CD4+ T 细胞耗竭后保护消失。
- **Figure S3**: tdLN scRNA-seq 的详细分析。(A-C) ZsGreen 分选策略和验证。(D-E) 全免疫细胞 UMAP 和组成变化——STING 激动剂处理后 IFN 激活的 CD4+ T 细胞、DC、CD8+ T 细胞富集。(F) CD4+ T 细胞亚聚类（Tconv, ISG-high, Treg, Th17, γδ T）——ISG-high 亚群在 STING 处理后增加。(G-H) DC 亚聚类——活化 DC 在 STING 处理后增加，cDC1 比例下降。
- **Figure S4**: (A) IFNγ 对 6694c2 体外生长无影响（B16F10 有抑制）——与 Ifnγr1−/− 体内结果一致。(B) Ifnγr1−/− 肿瘤在 WT 小鼠中仍可被三联疗法控制——IFNγ 不直接作用于肿瘤细胞。(C-F) ΔΔGata1 (嗜酸性粒细胞缺陷)、anti-Ly6G (中性粒细胞耗竭)、Mr1−/− γδ−/− (MAIT/γδ T 缺陷)、iNOS−/− 均有效控制肿瘤——排除多种候选效应器。
- **Figure S5**: FTY720 功能验证——外周血淋巴细胞计数显著下降，确认 FTY720 成功阻断 LN 淋巴细胞输出。
- **Figure S6**: DC 流式面板的详细门控策略。(A) 完整门控路径：单细胞 → F4/80− Ly6C− → CD11c+ → Sirpα/XCR1。(B-E) Batf3−/− 和 Δ1+2+3 小鼠的 DC 亚群验证——确认 cDC1 在 Batf3−/− 中缺失、cDC2 在 Δ1+2+3 中缺失。
- **Figure S7**: 巨噬细胞/单核细胞排除实验。(A) Ccr2−/− 小鼠的 tdLN 中 cDC2 仍然富集——排除所观察的 Sirpα+ 细胞是单核细胞而非 cDC2。(B-D) F4/80+ 巨噬细胞频率、CD80 表达、肿瘤抗原摄取分析——巨噬细胞不显示三联疗法后的激活变化；被膜下窦巨噬细胞在治疗后消失。(E-H) Ccr2−/−、anti-Ly6C、anti-CSF1R、Ccr2−/− + anti-CSF1R 四种模型均有效——巨噬细胞/单核细胞不需要。
- **Figure S8**: Type I IFN 排除实验。(A) 血清 IFNα 在 STING 注射后 4h 达峰。(B) Ifnar1−/− 小鼠 tdLN 中 cDC2 积累和激活不受影响。(C-D) Ifnar1−/− 小鼠对三联疗法仍有反应 (3/5 治愈)。(E) IFNα 对 6694c2 体外生长无影响。(F) Stat1−/− 肿瘤在 WT 小鼠中仍可被控制——进一步排除 IFN 信号的肿瘤内在效应。(G) Ifnγ−/− 小鼠中 cDC2 积累和激活不受影响——cDC2 激活在 IFNγ 上游。
- **Figure S9**: cDC2 代偿机制探索。(A-B) 6419c5 和 6694c2 皮下模型中 Δ1+2+3 小鼠仍有效（与正位模型对比）。(C) Δ1+2+3 小鼠 tdLN 中出现 Ly6C+ CD11c+ Sirpα+ MHC-II+ F4/80− XCR1− 细胞群，表达 CD80 并摄取肿瘤抗原——推测这一群体在皮下环境中功能代偿了 cDC2。
- **Figure S10**: DFCI 队列 scRNA-seq 的详细分析。(A) 全细胞 UMAP，化疗前后分割。(B-C) 聚类标志基因和组成比例。(D-F) 髓系细胞亚聚类（巨噬细胞、中性粒细胞、单核细胞、DC 等）的详细分析。
- **Figure S11**: Loveless et al. 数据再分析的详细补充——髓系细胞 UMAP、标志基因、DC 亚群差异表达基因 (cDC1/cDC2A/cDC2B/Activated DC)。
- **Figure S12**: Hwang et al. 数据再分析的详细补充——全细胞 UMAP (化疗前后)、组成比例、髓系亚聚类、DC 亚聚类、差异表达分析。化疗前后 DC 频率无显著变化，但化疗后 DC 的 AREG 表达增加。

### 补充数据

- **Data S1**: 原始数据表，包含所有流式细胞术数值、肿瘤体积测量、统计检验结果等，提供完整的实验数据透明度。
