import {
  sysInfo
} from "@/api/modules";
import {
  listMsg
} from "@/api/modules/sys/msg";

//岗位名称查询
import {
  list_API
} from "@/api/modules/process/webcompanystation";

const common = {
  state: {
    positionName: [],//岗位名称
    personSexList: [
      {
        label: "男",
        value: 1
      },
      {
        label: "女",
        value: 0
      }
    ],//男女
    certificateTypeList: [
      {
        label: "安全生产",
        value: "安全生产"
      },
      {
        label: "经营许可",
        value: "经营许可"
      },
      {
        label: "生产许可",
        value: "生产许可"
      },
      {
        label: "其他",
        value: "其他"
      }
    ],//证书类型
    personTypeList: [
      {
        label: "普通员工",
        value: "普通员工"
      },
      {
        label: "主要负责人",
        value: "主要负责人"
      },
      {
        label: "分管领导",
        value: "分管领导"
      },
      {
        label: "带班领导",
        value: "带班领导"
      },
      {
        label: "安全总监",
        value: "安全总监"
      },
      {
        label: "安全部长",
        value: "安全部长"
      },
      {
        label: "车间主任",
        value: "车间主任"
      },
      {
        label: "安全管理人员",
        value: "安全管理人员"
      },
      {
        label: "特种作业人员",
        value: "特种作业人员"
      },
      {
        label: "环保主任",
        value: "环保主任"
      },
      {
        label: "其他",
        value: "其他"
      }
    ],//人员类型
    highestEducationList: [
      {
        label: "博士生",
        value: "博士生"
      },
      {
        label: "研究生",
        value: "研究生"
      },
      {
        label: "本科生",
        value: "本科生"
      },
      {
        label: "专科",
        value: "专科"
      },
      {
        label: "高中",
        value: "高中"
      },
      {
        label: "初中",
        value: "初中"
      },
      {
        label: "小学",
        value: "小学"
      },
    ],//学历
    trueFalseList: [
      {
        label: "是",
        value: 1
      },
      {
        label: "否",
        value: 0
      }
    ],//是或者否
    whetherJob: [
      {
        label: "在职",
        value: 1
      },
      {
        label: "离职",
        value: 0
      }
    ],
    ExpiredList: [
      {
        label: "未过期",
        value: 1
      },
      {
        label: "已过期",
        value: 2
      }
    ],
    overdueFlagList: [
      {
        label: "未过期",
        value: "未过期"
      },
      {
        label: "已过期",
        value: "已过期"
      },
      // {
      //   label: "即将到期",
      //   value: "即将到期"
      // }
    ],
    DocumentsState: [
      {
        label: "草稿",
        value: 1
      },
      {
        label: "已评审",
        value: 2
      },
      // {
      //   label: "已废止",
      //   value: 3
      // }
    ],
    SafetyLevel: [
      {
        label: "一级",
        value: "一级"
      },
      {
        label: "二级",
        value: "二级"
      },
      {
        label: "三级",
        value: "三级"
      },
      {
        label: "未评定",
        value: "未评定"
      },
    ],
    systemInfo: {},
    systemVersions: [{
      label: "巡检+隐患排查基础版",
      value: 1
    },
    {
      label: "巡检+隐患排查升级版",
      value: 2
    },
    {
      label: "巡检+隐患排查+作业票基础版",
      value: 3
    },
    {
      label: "巡检+隐患排查+作业票升级版",
      value: 4
    },
    {
      label: "全流程强化版",
      value: 5
    }
    ],
    areaPositions: [{
      label: "生产区",
      value: 1
    },
    {
      label: "办公区",
      value: 2
    },
    {
      label: "其他",
      value: 3
    }
    ],
    areaTypes: [{
      label: "防爆",
      value: 1
    },
    {
      label: "非防爆",
      value: 2
    }
    ],
    userStatus: [{
      label: "禁用",
      value: 0
    },
    {
      label: "正常",
      value: 1
    },
    ],
    userStatus01: [
      {
        label: "正常",
        value: 1
      }, {
        label: "禁入",
        value: 0
      }
    ],
    problemTypes: [{
      label: "不安全行为",
      value: 1
    },
    {
      label: "不安全状态",
      value: 2
    },
    {
      label: "泄漏",
      value: 3
    },
    {
      label: "未遂事件",
      value: 4
    },
    {
      label: "设备报修",
      value: 5
    },
    {
      label: "其他",
      value: 6
    }
    ],
    problemState: [{
      label: "未处理",
      value: 0
    },
    {
      label: "已处理",
      value: 1
    },
    {
      label: "已处理并生成隐患",
      value: 2
    }
    ],
    problemStatus: [{
      label: "未处理",
      value: 0
    },
    {
      label: "已处理",
      value: 1
    },
    {
      label: "已处理并生成隐患",
      value: 2
    }
    ],
    pointTypes: [{
      label: "设备",
      value: 1
    },
    {
      label: "检查表",
      value: 2
    }
    ],
    deviceTypes: [{
      label: "常用",
      value: 1
    },
    {
      label: "备用",
      value: 2
    }
    ],
    lineTypes: [{
      label: "允许跳检",
      value: 2
    },
    {
      label: "按序巡检",
      value: 1
    }
    ],
    publishStatus: [{
      label: "未发布",
      value: 0
    },
    {
      label: "已发布",
      value: 1
    },
    ],
    taskTypes: [{
      label: "日常巡检",
      value: 1
    },
    {
      label: "临时任务",
      value: 0
    },
    {
      label: "周巡检",
      value: 2
    }
    ],
    taskStatus: [{
      label: "已发布",
      value: 1
    },
    {
      label: "任务中",
      value: 2
    },
    {
      label: "已完成",
      value: 3
    }
      // {
      //   label: "已撤销",
      //   value: 0
      // }
    ],
    inspectStatus: [{
      label: "已完成",
      value: 2
    },
    {
      label: "巡检中",
      value: 1
    },
    {
      label: "未开始",
      value: 4
    },
    {
      label: "未完成",
      value: 5
    }
    ],
    inspectResults: [{
      label: "漏检",
      value: 5
    }, {
      label: "未开始",
      value: 4
    },
    {
      label: "未完成",
      value: 3
    },
    {
      label: "延时完成",
      value: 2
    },
    {
      label: "正常完成",
      value: 1
    }
    ],
    messageTypes: [{
      label: "报警提示",
      value: 1
    },
    {
      label: "安全巡检",
      value: 2
    }
    ],

    sceneCategorys: [{
      label: "特种设备",
      value: 1
    },
    {
      label: "生产设备",
      value: 2
    }, {
      label: "场所环境",
      value: 3
    },
    {
      label: "从业人员操作行为",
      value: 4
    }, {
      label: "消防安全",
      value: 5
    },
    {
      label: "用电安全",
      value: 6
    }, {
      label: "职业卫生",
      value: 7
    },
    {
      label: "特殊作业",
      value: 8
    },
    {
      label: "辅助动力系统",
      value: 9
    },
    {
      label: "相关方安全管理",
      value: 10
    }, {
      label: "其他",
      value: 11
    }
    ],
    basisCategorys: [{
      label: "资质证照",
      value: 1
    },
    {
      label: "安全管理机构及人员",
      value: 2
    }, {
      label: "安全生产责任制",
      value: 3
    },
    {
      label: "安全生产管理制度",
      value: 4
    }, {
      label: "安全操作规程",
      value: 5
    },
    {
      label: "教育培训",
      value: 6
    }, {
      label: "安全生产管理档案",
      value: 7
    },
    {
      label: "安全生产投入",
      value: 8
    },
    {
      label: "应急管理",
      value: 9
    },
    {
      label: "特种设备基础管理",
      value: 10
    }, {
      label: "职业卫生基础管理",
      value: 11
    }, {
      label: "相关方基础管理",
      value: 12
    }, {
      label: "其他基础管理",
      value: 13
    }
    ],
    dangerLevels: [{
      label: "一般隐患",
      value: 1
    },
    {
      label: "重大隐患",
      value: 2
    }],
    dangerSourceLevels: [{
      label: "一级",
      value: "一级"
    },
    {
      label: "二级",
      value: "二级"
    },
    {
      label: "三级",
      value: "三级"
    },
    {
      label: "四级",
      value: "四级"
    }
    ],
    dangerHarms: [{
      label: "物体打击",
      value: 1
    },
    {
      label: "机械伤害",
      value: 2
    },
    {
      label: "起重伤害",
      value: 3
    },
    {
      label: "车辆伤害",
      value: 4
    }, {
      label: "触电",
      value: 5
    },
    {
      label: "淹溺",
      value: 6
    },
    {
      label: "灼烫",
      value: 7
    },
    {
      label: "火灾",
      value: 8
    },
    {
      label: "高处坠落",
      value: 9
    }, {
      label: "坍塌",
      value: 10
    }, {
      label: "锅炉爆炸",
      value: 11
    },
    {
      label: "容器爆炸",
      value: 12
    },
    {
      label: "瓦斯爆炸",
      value: 13
    },
    {
      label: "火药爆炸",
      value: 14
    },
    {
      label: "其他爆炸",
      value: 15
    }, {
      label: "中毒和窒息",
      value: 16
    }, {
      label: "冒顶片帮",
      value: 17
    },
    {
      label: "透水",
      value: 18
    },
    {
      label: "放炮",
      value: 19
    },
    {
      label: "其他伤害",
      value: 20
    }
    ],
    dangerSources: [{
      label: "日常巡检",
      value: 1
    },
    {
      label: "现场检查",
      value: 2
    },
    {
      label: "政府监督检查",
      value: 3
    },
    {
      label: "标准化自评/评审",
      value: 4
    }, {
      label: "其他",
      value: 5
    }
    ],
    workTypes: [{
      label: "动火作业",
      value: 1,
      disabled: false
    },
    {
      label: "受限空间作业",
      value: 2,
      disabled: false
    },
    {
      label: "高处作业",
      value: 3,
      disabled: false
    },
    {
      label: "吊装作业",
      value: 4,
      disabled: false
    },
    {
      label: "临时用电作业",
      value: 5,
      disabled: false
    },
    {
      label: "动土作业",
      value: 6,
      disabled: false
    },
    {
      label: "断路作业",
      value: 7,
      disabled: false
    },
    {
      label: "盲板抽堵作业",
      value: 8,
      disabled: false
    }
    ],
    workTypes01: [{
      label: "动火作业",
      value: "动火作业",
      disabled: false
    },
    {
      label: "受限空间作业",
      value: "受限空间作业",
      disabled: false
    },
    {
      label: "高处作业",
      value: "高处作业",
      disabled: false
    },
    {
      label: "吊装作业",
      value: "吊装作业",
      disabled: false
    },

    {
      label: "临时用电作业",
      value: "临时用电作业",
      disabled: false
    },
    {
      label: "动土作业",
      value: "动土作业",
      disabled: false
    },
    {
      label: "断路作业",
      value: "断路作业",
      disabled: false
    },
    {
      label: "盲板抽堵作业",
      value: "盲板抽堵作业",
      disabled: false
    }
    ],
    workStatus: [{
      label: "草稿",
      value: 1
    },
    {
      label: "评估审批退回",
      value: 2
    },
    {
      label: "待评估审批",
      value: 10
    },
    {
      label: "现场确认",
      value: 20
    },
    {
      label: "待远程签发",
      value: 30
    },
    {
      label: "已签发",
      value: 40
    },
    {
      label: "已延期",
      value: 41
    },
    {
      label: "延期申请退回",
      value: 42
    },
    {
      label: "完工申请退回",
      value: 43
    },
    {
      label: "待延期签发",
      value: 50
    },
    {
      label: "待完工审批",
      value: 60
    },
    {
      label: "已关闭",
      value: 90
    },
    {
      label: "已完成",
      value: 100
    }
    ],
    specialWorkTypes: [{
      label: "电工作业",
      value: 1
    },
    {
      label: "焊接与热切割",
      value: 2
    },
    {
      label: "高处作业",
      value: 3
    },
    {
      label: "制冷与空调作业",
      value: 4
    },
    {
      label: "煤矿安全作业",
      value: 5
    },
    {
      label: "金属非金属矿山安全作业",
      value: 6
    },
    {
      label: "冶金(有色)生产安全作业",
      value: 7
    },
    {
      label: "危险化学品安全作业",
      value: 8
    }
    ],
    reformTypes: [{
      label: "立即整改",
      value: 1
    },
    {
      label: "限期整改",
      value: 2
    },
    {
      label: "停业停产整顿",
      value: 3
    }
    ],
    workDHlevels: [{
      label: "一级动火",
      value: 1
    },
    {
      label: "二级动火",
      value: 2
    },
    {
      label: "特级动火",
      value: 3
    },
    {
      label: "轻度热作业",
      value: 0
    }
    ],
    workGClevels: [{
      label: "一级高处/2~5米",
      value: 1
    },
    {
      label: "二级高处/5~15米",
      value: 2
    },
    {
      label: "三级高处/15~30米",
      value: 3
    },
    {
      label: "特级高处/>30米",
      value: 4
    }
    ],
    workDZlevels: [{
      label: "一级吊装/>100t",
      value: 1
    },
    {
      label: "二级吊装/40~100t",
      value: 2
    },
    {
      label: "三级吊装/<100t",
      value: 3
    }
    ],
    gasCheckRates: [{
      label: "30分钟",
      value: 30
    },
    {
      label: "1小时",
      value: 60
    },
    {
      label: "2小时",
      value: 120
    }
    ],
    workProblems: [{
      label: "作业票未正常关闭",
      value: 1
    },
    {
      label: "许可证遗失或未及时归档",
      value: 2
    },
    {
      label: "作业票类别/级别选择错误",
      value: 3
    },
    {
      label: "缺少相关联作业票",
      value: 4
    },
    {
      label: "风险辨识不全面",
      value: 5
    },
    {
      label: "气体检测未按照要求频率录入",
      value: 6
    },
    {
      label: "现场措施确认不到位",
      value: 7
    },
    {
      label: "作业现场缺少监护人",
      value: 8
    },
    {
      label: "现场作业人员缺少特殊工种资质",
      value: 9
    },
    {
      label: "其他问题",
      value: 10
    }
    ],
    riskLevels: [{
      label: "重大风险",
      value: 4
    },
    {
      label: "较大风险",
      value: 3
    },
    {
      label: "一般风险",
      value: 2
    },
    {
      label: "低风险",
      value: 1
    }
    ],
    hazardSourceType: [{
      label: "设备设施",
      value: 1
    },
    {
      label: "作业活动",
      value: 2
    }
    ],
    hazardSourceArea: [{
      label: "装车区域",
      value: 1
    },
    {
      label: "发货区域",
      value: 2
    }
    ],
    controlLevels: [
      {
        label: "岗位",
        value: 1
      },
      {
        label: "班组",
        value: 2
      },
      {
        label: "车间",
        value: 3
      },
      {
        label: "公司",
        value: 4
      }
    ],
    algorithmTypes: [
      {
        label: "LS",
        value: 'ls'
      },
      {
        label: "LEC",
        value: 'lec'
      },
      {
        label: "MES",
        value: 'mes'
      }
    ],
    deviceClass: [
      {
        label: "生产设备",
        value: 1
      },
      {
        label: "特种设备",
        value: 2
      },
      {
        label: "其他",
        value: 0
      }
    ],
    targetTypes: [
      {
        label: "目标",
        value: 1
      },
      {
        label: "指标",
        value: 2
      }
    ],
    targetLevels: [
      {
        label: "公司级",
        value: 1
      },
      {
        label: "班组级",
        value: 2
      },
      {
        label: "车间级",
        value: 3
      },
      {
        label: "部门级",
        value: 4
      },
      {
        label: "部门分厂级",
        value: 5
      }
    ],
    planLevels: [
      {
        label: "公司级",
        value: 1
      },
      {
        label: "车间级",
        value: 2
      },
      {
        label: "班组级",
        value: 3
      }
    ],
    drillLevels: [
      {
        label: '公司级',
        value: 1
      },
      {
        label: '分厂级',
        value: 2
      },
      {
        label: '车间级',
        value: 3
      }
    ],
    drillModes: [
      {
        label: '桌面',
        value: 1
      },
      {
        label: '综合',
        value: 2
      },
      {
        label: '专项',
        value: 3
      }
    ],
    drillStatus: [
      {
        label: '已评价',
        value: 1
      },
      {
        label: '待演练',
        value: 2
      },
      {
        label: '已废止',
        value: 3
      }
    ],
    ranksLevels: [
      {
        label: "公司",
        value: 1
      },
      {
        label: "分厂-车间",
        value: 2
      },
      {
        label: "工序-班组",
        value: 3
      }
    ],
    chagenTypes: [
      {
        label: "工艺变更",
        value: 1
      },
      {
        label: "设备变更",
        value: 2
      },
      {
        label: "人员变更",
        value: 3
      },
      {
        label: "其他变更",
        value: 4
      }
    ],
    accidentReasons: [
      {
        label: "人的不安全行为",
        value: 1
      },
      {
        label: "物的不安全的状态",
        value: 2
      },
      {
        label: "管理上的缺陷",
        value: 3
      }
    ],
    accidentLevels: [
      {
        label: "A级（公司级重大事）",
        value: 1
      },
      {
        label: "B级（公司级一般事故）",
        value: 2
      },
      {
        label: "C级（车间班组事故）",
        value: 3
      },
      {
        label: "D级（轻微级事故）",
        value: 4
      },
      {
        label: "E级（未遂事件）",
        value: 5
      },
      {
        label: "其他",
        value: 6
      }
    ],
    accidentTypes: [
      {
        label: "人员伤亡事故",
        value: 1
      },
      {
        label: "火灾爆炸事故",
        value: 2
      },
      {
        label: "危化品泄漏事故",
        value: 3
      },
      {
        label: "设备事故",
        value: 4
      },
      {
        label: "工艺事故",
        value: 5
      }
    ],
    accidentCause: [
      {
        label: "消防方面存在的缺陷",
        value: 1
      },
      {
        label: "变更管理类缺陷",
        value: 2
      },
      {
        label: "未取得危险化学品经营许可证或危险化学品经营",
        value: 3
      },
      {
        label: "许可证过期",
        value: 4
      },
      {
        label: "辅助动力系统缺陷",
        value: 5
      },
      {
        label: "特种设备基础管理缺陷",
        value: 6
      },
      {
        label: "生产设备设施及工艺方面存在的缺陷",
        value: 7
      },
      {
        label: "未建立安全生产管理档案或档案建立不完善的",
        value: 8
      },
      {
        label: "用电安全方面的问题和缺陷",
        value: 9
      },
      {
        label: "设置安全生产管理机构、且仅配备兼职安全生产管理人员",
        value: 10
      },
      {
        label: "生产安全投入方面存在的问题和缺陷",
        value: 11
      },
      {
        label: "安全生产管理制度不健全",
        value: 12
      },
      {
        label: "特种设备现场管理缺陷",
        value: 13
      },
      {
        label: "未开展安全生产教育培训或是在培训时间、培训内容不达标的",
        value: 14
      },
      {
        label: "相关方基础管理类隐患（承包商/施工队）",
        value: 15
      },
      {
        label: "安全栏信息展示沟通缺陷",
        value: 16
      },
      {
        label: "未建立安全生产责任制或责任制建立不完善",
        value: 17
      },
      {
        label: "职业卫生基础管理缺陷",
        value: 18
      },
      {
        label: "其他现场管理类缺陷",
        value: 19
      },
      {
        label: "有限空间现场安缺陷",
        value: 20
      },
      {
        label: "缺少岗位操作规程或是岗位操作规程制定不完善的",
        value: 21
      },
      {
        label: "应急救援方面存在的问题和缺陷",
        value: 22
      },
      {
        label: "从业人员操作行为缺陷",
        value: 23
      },
      {
        label: "场所环境类缺陷",
        value: 24
      }
    ],
    dangerTypes: [
      {
        label: "现场管理类",
        value: '现场管理类'
      },
      {
        label: "基础管理类",
        value: '基础管理类'
      }
    ],
    lifeStatus: [
      {
        label: "已投用",
        value: 1
      },
      {
        label: "库存种",
        value: 2
      },
      {
        label: "报废",
        value: 3
      }
    ],
    alarmTypes: [
      {
        label: "未戴安全帽",
        value: 4
      },
      {
        label: "未穿工作服",
        value: 5
      },
      {
        label: "打电话",
        value: 6
      },
      {
        label: "吸烟报警",
        value: 7
      },
      {
        label: "烟火报警",
        value: 8
      },
      {
        label: "睡岗",
        value: 16
      },
      {
        label: "离岗",
        value: 17
      },
      {
        label: "通道占用",
        value: 18
      },
      {
        label: "物品遗失",
        value: 19
      },
      {
        label: "区域入侵",
        value: 20
      },
      {
        label: "电动车进电梯",
        value: 21
      },
      {
        label: "消防通道占用",
        value: 22
      }
    ],
    checkTypes: [{
      label: "报告类",
      value: 1,
      type: 1
    }, {
      label: "电仪类",
      value: 2,
      type: 2
    }, {
      label: "公司资质类",
      value: 3,
      type: 3
    }, {
      label: "环保类",
      value: 4,
      type: 2
    }, {
      label: "设备类",
      value: 5,
      type: 2
    }, {
      label: "消防类",
      value: 6,
      type: 2
    }, {
      label: "职业卫生类",
      value: 7,
      type: 1
    }],
    stdWarnTimes: [{
      label: "1个月内",
      value: 30
    },
    {
      label: "2个月内",
      value: 60
    },
    {
      label: "1个季度内",
      value: 90
    },
    {
      label: "半年内",
      value: 180
    }
    ],
    lawTypes: [
      {
        label: "法律",
        value: 1
      },
      {
        label: "行政法规",
        value: 2
      },
      {
        label: "地方性法规",
        value: 3
      }
    ],
    lawStatus: [
      {
        label: "有效",
        value: 0
      },
      {
        label: "尚未生效",
        value: 1
      },
      {
        label: "废止",
        value: 2
      }
    ],
    standardStatus: [
      {
        label: "现行",
        value: 0
      },
      {
        label: "即将实施",
        value: 1
      },
      {
        label: "作废",
        value: 2
      },
      {
        label: "废止",
        value: 3
      }
    ],
    secDocStatus: [
      {
        label: "有效",
        value: 0
      },
      {
        label: "尚未生效",
        value: 1
      },
      {
        label: "失效",
        value: 2
      }
    ],
    msdsParams: [
      {
        label: "中文名称",
        value: 'vagueCnName'
      },
      {
        label: "精确名称",
        value: 'exactCnName'
      },
      {
        label: "英文名称",
        value: 'enName'
      },
      {
        label: "CAS.No",
        value: 'casno'
      }
    ],
    treeSetting: {
      data: {
        simpleData: {
          enable: true,
          idKey: "menuId",
          pIdKey: "parentId",
          rootPId: -1
        }
      },
      check: {
        enable: true
      },
      view: {
        showIcon: false,
        dblClickExpand: false
      }
    },
    tableHeight: document.documentElement.scrollHeight - 270 + "px",
    bMapApiKey: "baSgMVgbCCuqour7aOYVu06R",
    unreadMessage: {
      total: 0,
      types: []
    },
    screenfull: false
  },

  mutations: {
    SET_SYSTEMINFO: (state, systemInfo) => {
      state.systemInfo = systemInfo
    },
    SET_UNREADMESSAGE: (state, unreadMessage) => {
      state.unreadMessage = unreadMessage
    },
    SET_POSITIONNAME(state, positionName) {
      state.positionName = positionName
    },
    SET_SCREENFULL: (state, screenfull) => {
      state.screenfull = screenfull
    }
  },

  actions: {

    //获取岗位名称
    GetPositionName({
      commit
    }) {
      let params = {
        limit: 100,
        page: 1
      }
      return new Promise(resolve => {
        list_API(params).then(res => {
          const result = res.result.list;
          commit('SET_POSITIONNAME', result)
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 设置全屏显示
    SetScreenfull({
      commit
    }, screenfull) {
      commit('SET_SCREENFULL', screenfull)
    },
    // 获取系统信息
    GetSystemInfo({
      commit
    }) {
      sysInfo().then(response => {
        const result = response.result;
        commit('SET_SYSTEMINFO', {
          id: result.id,
          systemName: result.systemName,
          systemShort: result.systemShort,
          systemLogoFile: result.systemLogoFile,
          systemTec: result.systemTec
        })
      });
    },
    // 设置系统信息
    SetSystemInfo({
      commit
    }, systemInfo) {
      commit('SET_SYSTEMINFO', systemInfo)
    },
    // 获取未读消息数量
    GetUnreadMessage({
      commit
    }) {
      listMsg({
        limit: 1000000,
        status: 0
      }).then(response => {
        const result = response.result;
        const types = [];
        const alarms = result.list.filter(item => {
          return item.mainType === "报警提示"
        })
        const inspects = result.list.filter(item => {
          return item.mainType === "安全巡检"
        })
        let total = 0
        if (alarms.length > 0) {
          types.push({
            name: "报警提示",
            count: alarms.length
          })
          total += alarms.length
        }
        if (inspects.length > 0) {
          types.push({
            name: "安全巡检",
            count: inspects.length
          })
          total += inspects.length
        }
        commit('SET_UNREADMESSAGE', {
          total,
          types
        })
      });
    },
  }
}

export default common
