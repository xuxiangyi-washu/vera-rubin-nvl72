export const inferencePhases=[
 {title:'模型分片与 rank 映射',detail:'框架把示例权重分成 W0—W5，由3个独立OS域中的6个GPU进程持有。NCCL rank是通信组成员，不自动等于物理GPU编号。',sources:['NC02','HW91']},
 {title:'通信组与安全前提',detail:'进程通过主机通信机制共享NCCL unique ID并初始化communicator。Realm概念模式还需要CPU/GPU证明、设备授权和受保护会话；NCCL本身不完成这些安全步骤。',sources:['NC02','SEC10','SEC11']},
 {title:'预填充 / 输入激活',detail:'推理框架准备token与激活，并按并行方案分发。NCCL可承担所需广播；tokenization、模型切分和调度属于上层框架。',sources:['NC01','NC02']},
 {title:'GPU 分片计算',detail:'每个GPU使用自己的权重分片执行CUDA计算，得到部分结果。示例采用张量并行的一次求和归约，不代表某个模型完整的层执行图。',sources:['NC01','HW05']},
 {title:'Reduce-Scatter · 5轮',detail:'6个逻辑rank围成教学环，每轮各发送一个分块给下一rank并累加。5轮后每个rank拥有一个已完成归约的分块。实际NCCL算法可能因拓扑、消息尺寸和版本不同而改变。',sources:['NC01','SEC16']},
 {title:'AllGather · 5轮',detail:'各rank继续沿逻辑环交换已归约分块。5轮后，每个rank都得到完整结果[21,42,63,84,105,126]，等价于此示例的AllReduce。',sources:['NC01']},
 {title:'继续后续层计算',detail:'框架按模型结构继续Attention、投影、FFN等计算及必要通信。实际模型可能使用不同collective或流水线，不是每层只固定执行一次AllReduce。',sources:['NC01','HW05']},
 {title:'采样与下一轮解码',detail:'上层推理框架完成输出处理与采样，再把新token用于后续解码。这里显示的是预设教学文本，不是真实LLM生成结果。',sources:['NC01']},
 {title:'教学演示完成',detail:'已演示4轮token进展。可复位、选择任一步或切换普通OS/Realm概念模式。',sources:['NC01','NC02']},
];
export const teachingTokens=['机架级','互联','支撑','推理'];
