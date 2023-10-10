// 演练计划表单验证
export const PLAN_RULES = {
  maker: [
    { required: true, message: '制定人不能为空', trigger: 'blur' }
  ],
  makeDept: [
    { required: true, message: '制定部门不能为空', trigger: 'blur' }
  ],
  makeDate: [
    { required: true, message: '制定时间不能为空', trigger: 'blur' }
  ],
  editDate: [
    { required: true, message: '修改时间不能为空', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '演练名称不能为空', trigger: 'blur' }
  ],
  place: [
    { required: true, message: '演练地点不能为空', trigger: 'blur' }
  ],
  dept: [
    { required: true, message: '主办部门不能为空', trigger: 'blur' }
  ],
  mode: [
    { required: true, message: '演练方式不能为空', trigger: 'blur' }
  ],
  planId: [
    { required: true, message: '应急预案不能为空', trigger: 'blur' }
  ],
  level: [
    { required: true, message: '演练级别不能为空', trigger: 'blur' }
  ],
  planDate: [
    { required: true, message: '计划制定日期不能为空', trigger: 'blur' }
  ],
  drillDate: [
    { required: true, message: '计划演练日期不能为空', trigger: 'blur' }
  ],
  // memo: [
  //   { required: true, message: '备注不能为空', trigger: 'blur' }
  // ],
  status: [
    { required: true, message: '状态不能为空', trigger: 'blur' }
  ],
  fileList: [
    { required: true, message: '附件列表不能为空', trigger: 'blur' }
  ]
}

// 演练记录表单验证
export const OPER_RULES = {
  drillPlanName: [
    { required: true, message: '演练名称不能为空', trigger: 'blur' }
  ],
  place: [
    { required: true, message: '演练地点不能为空', trigger: 'blur' }
  ],
  mode: [
    { required: true, message: '演练方式不能为空', trigger: 'blur' }
  ],
  level: [
    { required: true, message: '演练级别不能为空', trigger: 'blur' }
  ],
  emergencyPlan: [
    { required: true, message: '应急预案不能为空', trigger: 'blur' }
  ],
  planDate: [
    { required: true, message: '计划演练日期不能为空', trigger: 'blur' }
  ],
  organizer: [
    { required: true, message: '主办单位不能为空', trigger: 'blur' }
  ],
  realDate: [
    { required: true, message: '实际演练日期不能为空', trigger: 'blur' }
  ],
  respUser: [
    { required: true, message: '演练负责人不能为空', trigger: 'blur' }
  ],
  joinUser: [
    { required: true, message: '主要参演人员不能为空', trigger: 'blur' }
  ],
  assessor: [
    { required: true, message: '评估人员不能为空', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '演练内容不能为空', trigger: 'blur' }
  ],
  purpose: [
    { required: true, message: '演练目的不能为空', trigger: 'blur' }
  ],
  review: [
    { required: true, message: '预案评审不能为空', trigger: 'blur' }
  ],
  userInPlace: [
    { required: true, message: '人员到位情况不能为空', trigger: 'blur' }
  ],
  materialInPlace: [
    { required: true, message: '物资到位情况不能为空', trigger: 'blur' }
  ],
  harmonize: [
    { required: true, message: '协调组织情况不能为空', trigger: 'blur' }
  ],
  effect: [
    { required: true, message: '实战效果情况不能为空', trigger: 'blur' }
  ],
  cooperation: [
    { required: true, message: '支援部门和协作有效性不能为空', trigger: 'blur' }
  ],
  ifProblem: [
    { required: true, message: '存在问题和改进措施不能为空', trigger: 'blur' }
  ],
  ifImprove: [
    { required: true, message: '是否需要修改应急预案不能为空', trigger: 'blur' }
  ],
  examState: [
    { required: true, message: '部门领导审核不能为空', trigger: 'blur' }
  ]
}