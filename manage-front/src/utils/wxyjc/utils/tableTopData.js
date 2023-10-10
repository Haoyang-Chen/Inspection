import {
  isAuth
} from './index'
export const modleData = {
  showIndex: true, // 是否显示序号
  selectionType: true, // 是否启用选框
  pagination: true, // 是否启用分页
  tableList: [{
    label: '表头名称', // 表头名称
    prop: 'name', // 字段
    type: 'click' // 是否需要绑定的事件或过滤
  }, {
    label: '表头名称2',
    prop: 'name2'
  }],
  operate: {
    width: '',
    btnList: [
      // 操作栏
      {
        label: '新增',
        prop: 'add',
        type: 'success'
      },
      {
        label: '删除',
        prop: 'del',
        type: 'danger'
      }
    ]
  }
};
export const enterpriseDangerousChemicalsData = {
  showIndex: true, // 是否显示序号
  selectionType: true, // 是否启用选框
  pagination: true, // 是否启用分页
  tableList: [{
    label: '危化品名称',
    prop: 'dangerName'
  }, {
    label: 'CAS号',
    prop: 'casNo'
  }, {
    label: '储存方式',
    prop: 'storageMethod',
    type: 'textFilter'
  }, {
    label: '危化品类别',
    prop: 'chemicalsCategoryName'
  }, {
    label: '重点监管',
    prop: 'isSupervision',
    type: 'yesOrNo'
  }, {
    label: '易制毒',
    prop: 'isEasytoxic',
    type: 'yesOrNo'
  }, {
    label: '年用量/年产量',
    prop: 'outputVolume'
  }, {
    label: '最大储量',
    prop: 'reservesVolume'
  }],
  operate: {
    width: '',
    btnList: [
      // 操作栏
      {
        label: '编辑',
        prop: 'edit',
        // classList: ['el-icon-setting', 'table-operation'],
        // style: "color: #2db7f5;",
        type: 'text',
        isAuth: 'dangerousInfo:update'
      },
      {
        label: '删除',
        prop: 'del',
        // classList: ['el-icon-delete', 'table-operation'],
        // style: "color: #f50;",
        type: 'text',
        isAuth: 'dangerousInfo:delete'
      }
    ]
  }
};
export const enterpriseDangerousSourceData = {
  showIndex: true, // 是否显示序号
  selectionType: true, // 是否启用选框
  pagination: true, // 是否启用分页
  tableList: [{
    label: '重大危险源名称',
    prop: 'hazardName'
  }, {
    label: '重大危险源/区域编号',
    prop: 'hazardNo'
  }],
  operate: {
    width: '150',
    btnList: [
      // 操作栏
      {
        label: '编辑',
        prop: 'edit',
        type: 'text',
        isAuth: 'dangerousHazard:update'
      },
      {
        label: '删除',
        prop: 'del',
        type: 'text',
        isAuth: 'dangerousHazard:delete'
      }
    ]
  }
};
export const enterpriseStorageTankWarehouseeData = {
  showIndex: true, // 是否显示序号
  selectionType: true, // 是否启用选框
  pagination: true, // 是否启用分页
  tableList: [{
    label: '设备名称编号',
    prop: 'deviceNo'
  }, {
    label: '设备内介质',
    prop: 'deviceMedia'
  }, {
    label: '罐类型',
    prop: 'tankType',
    type: 'textFilter'
  }, {
    label: '罐压力类型',
    prop: 'tankPressureType',
    type: 'textFilter'
  }, {
    label: '罐温度类型',
    prop: 'tankTempType',
    type: 'textFilter'
  }, {
    label: '投用日期',
    prop: 'useDate'
  }, {
    label: '最近检维修日期',
    prop: 'lastMaintenanceDate'
  }],
  operate: {
    width: '150',
    btnList: [
      // 操作栏
      {
        label: '编辑',
        prop: 'edit',
        type: 'text',
        isAuth: 'dangerousTank:update'
      },
      {
        label: '删除',
        prop: 'del',
        type: 'text',
        isAuth: 'dangerousTank:delete'
      }
    ]
  }
};
export const enterpriseDeviceData = {
  showIndex: true, // 是否显示序号
  selectionType: true, // 是否启用选框
  pagination: true, // 是否启用分页
  tableList: [{
    label: '装置名称编号',
    prop: 'deviceNo'
  }, {
    label: '所属工艺大类',
    prop: 'processCategoryName'
  }, {
    label: '所属工艺细类',
    prop: 'processCategorySubName'
  }, {
    label: '安全仪表系统投用状态位号',
    prop: 'statusTagNo'
  }, {
    label: '安全仪表连锁回路总数',
    prop: 'circuitsTotal'
  }],
  operate: {
    width: '150',
    btnList: [
      // 操作栏
      {
        label: '编辑',
        prop: 'edit',
        type: 'text',
        isAuth: 'dangerousApparatus:update'
      },
      {
        label: '删除',
        prop: 'del',
        type: 'text',
        isAuth: 'dangerousApparatus:delete'
      }
    ]
  }
};
export const enterpriseGasLeakDetectionPointData = {
  showIndex: true, // 是否显示序号
  selectionType: true, // 是否启用选框
  pagination: true, // 是否启用分页
  tableList: [{
    label: '设备名称编号',
    prop: 'deviceNo'
  }, {
    label: '设备类别',
    prop: 'deviceCategory'
  }, {
    label: '检测气体',
    prop: 'gasDetection'
  }, {
    label: '设备描述',
    prop: 'deviceDes'
  }],
  operate: {
    width: '150',
    btnList: [
      // 操作栏
      {
        label: '编辑',
        prop: 'edit',
        type: 'text',
        isAuth: 'dangerousGasPoint:update'
      },
      {
        label: '删除',
        prop: 'del',
        type: 'text',
        isAuth: 'dangerousGasPoint:delete'
      }
    ]
  }
};
export const enterpriseEquipmentIndexFillingData = {
  showIndex: true, // 是否显示序号
  selectionType: true, // 是否启用选框
  pagination: true, // 是否启用分页
  tableList: [{
    label: '设备类别',
    prop: 'deviceCategory'
  }, {
    label: '设备名称编号',
    prop: 'deviceNo'
  }],
  operate: {
    width: '150',
    btnList: [
      // 操作栏
      {
        label: '编辑',
        prop: 'edit',
        type: 'text',
        isAuth: 'deviceMonit:update'
      },
      {
        label: '删除',
        prop: 'del',
        type: 'text',
        isAuth: 'deviceMonit:delete'
      }
    ]
  }
};
export const enterpriseAlarmProcessingData = {
  showIndex: true, // 是否显示序号
  selectionType: false, // 是否启用选框
  pagination: true, // 是否启用分页
  tableList: [{
    label: '设备类别',
    prop: 'deviceCategory'
  }, {
    label: '设备名称编号',
    prop: 'deviceNo'
  }, {
    label: '指标类型',
    prop: 'keyMonitorParameters'
  }, {
    label: '计量单位',
    prop: 'unit'
  }, {
    label: '低低报',
    prop: 'alarmMinLmt'
  }, {
    label: '高高报',
    prop: 'alarmMaxLmt'
  }, {
    label: '低报',
    prop: 'alarmLowLmt'
  }, {
    label: '高报',
    prop: 'alarmHighLmt'
  }, {
    label: '实时数据',
    prop: 'realTimeData'
  }, {
    label: '最新报警时间',
    prop: 'collectTime'
  }, {
    label: '处理状态',
    prop: 'dealState',
    type: 'dealState'
  }, {
    label: '操作',
    prop: 'handlingAlarms',
    type: 'click',
    isAuthType: true
  }]
};
export const enterpriseAlarmProcessingListData = {
  showIndex: true, // 是否显示序号
  selectionType: false, // 是否启用选框
  pagination: true, // 是否启用分页
  tableList: [{
    label: '报警时间',
    prop: 'collectTime'
  }, {
    label: '实时数据',
    prop: 'realTimeData'
  }, {
    label: '低低报',
    prop: 'alarmMinLmt'
  }, {
    label: '高高报',
    prop: 'alarmMaxLmt'
  }, {
    label: '低报',
    prop: 'alarmLowLmt'
  }, {
    label: '高报',
    prop: 'alarmHighLmt'
  }, {
    label: '报警原因',
    prop: 'causeAlarm'
  }, {
    label: '报警处理',
    prop: 'alarmDeal'
  }, {
    label: '处理时间',
    prop: 'dealTime'
  }]
};
export const enterpriseMajorHazardInstallationsData = {
  showIndex: true, // 是否显示序号
  selectionType: false, // 是否启用选框
  pagination: true, // 是否启用分页
  tableList: [{
    label: '设备名称编号',
    prop: 'deviceNo'
  }, {
    label: '储罐内介质',
    prop: 'deviceMedia'
  }, {
    label: '储罐类型',
    prop: 'tankType'
  }, {
    label: '罐容积',
    prop: 'tankUnitVolume'
  }, {
    label: '罐高',
    prop: 'tankUnitHeightVolume'
  }, {
    label: '罐径',
    prop: 'tankUnitDiameterVolume'
  }, {
    label: '罐液位最高值',
    prop: 'tankUnitMaximumVolume'
  }, {
    label: '液位',
    prop: 'tankUnitLcVolume'
  }, {
    label: '储量比例',
    prop: 'tankUnitRatioVolume'
  }, {
    label: '温度',
    prop: 'tankUnitTempVolume'
  }, {
    label: '压力',
    prop: 'tankUnitPresVolume'
  }]
};
export const enterpriseCombustibleToxicGasData = {
  showIndex: true, // 是否显示序号
  selectionType: false, // 是否启用选框
  pagination: true, // 是否启用分页
  tableList: [{
    label: '设备名称编号',
    prop: 'deviceNo'
  }, {
    label: '设备类别',
    prop: 'deviceCategory'
  }, {
    label: '检测气体',
    prop: 'gasDetection'
  }, {
    label: '浓度',
    prop: 'tinickness'
  }]
};
export const enterpriseHazardousProcessLeftData = {
  showIndex: true, // 是否显示序号
  selectionType: false, // 是否启用选框
  pagination: true, // 是否启用分页
  tableList: [{
    label: '设备名称',
    prop: 'deviceNo'
  }, {
    label: '所属工艺',
    prop: 'processCategoryName'
  }, {
    label: '典型工艺装置',
    prop: 'processCategorySubName'
  }]
};
export const governmentEnterpriseListData = {
  showIndex: true, // 是否显示序号
  selectionType: false, // 是否启用选框
  pagination: true, // 是否启用分页
  tableList: [{
    label: '企业名称',
    prop: 'compName'
  }, {
    label: '实际生产经营地址',
    prop: 'proAddress'
  }, {
    label: '企业规模',
    prop: 'scaleSituation'
  }, {
    label: '重大危险源等级',
    prop: 'isHazardGrade'
  }, {
    label: '企业风险等级',
    prop: 'safetyRiskLevel'
  }, {
    label: '安全标准化等级',
    prop: 'safetyStandardLevel'
  }, {
    label: '联系人',
    prop: 'corporationName'
  }, {
    label: '联系电话',
    prop: 'corporationMobile'
  }],
  operate: {
    width: '90',
    btnList: [
      // 操作栏
      {
        label: '查看',
        prop: 'see',
        type: 'text',
      }
    ]
  }
};
export const governmentNonVirulentData = {
  showIndex: true, // 是否显示序号
  selectionType: false, // 是否启用选框
  pagination: true, // 是否启用分页
  tableList: [{
    label: '企业名称',
    prop: 'compName'
  }, {
    label: '类别',
    prop: 'category'
  }, {
    label: '危化品名称',
    prop: 'dangerName'
  }, {
    label: 'CAS号',
    prop: 'casNo'
  }, {
    label: '储存方式',
    prop: 'storageMethod'
  }, {
    label: '年用量/年产量（t）',
    prop: 'outputVolume'
  }, {
    label: '最大储量（t）',
    prop: 'reservesVolume'
  }, {
    label: '危化品类别',
    prop: 'chemicalsCategoryName'
  }, {
    label: '重点监管',
    prop: 'isSupervision',
    type: 'yesOrNo'
  }, {
    label: '易制毒',
    prop: 'isEasytoxic',
    type: 'yesOrNo'
  }],
  operate: {
    width: '90',
    btnList: [
      // 操作栏
      {
        label: '查看',
        prop: 'see',
        type: 'text',
      }
    ]
  }
};
export const governmentDangerousSourceData = {
  showIndex: true, // 是否显示序号
  selectionType: false, // 是否启用选框
  pagination: true, // 是否启用分页
  tableList: [{
    label: '企业名称',
    prop: 'compName'
  }, {
    label: '重大危险源名称',
    prop: 'hazardName'
  }, {
    label: '重大危险源/区域编号',
    prop: 'hazardNo'
  }]
};
export const governmentStorageTankWarehouseData = {
  showIndex: true, // 是否显示序号
  selectionType: false, // 是否启用选框
  pagination: true, // 是否启用分页
  tableList: [{
    label: '企业名称',
    prop: 'compName'
  }, {
    label: '设备名称编号',
    prop: 'deviceNo'
  }, {
    label: '设备内介质',
    prop: 'deviceMedia'
  }, {
    label: '罐类型',
    prop: 'tankType',
    type: 'textFilter'
  }, {
    label: '罐压力类型',
    prop: 'tankPressureType',
    type: 'textFilter'
  }, {
    label: '罐温度类型',
    prop: 'tankTempType',
    type: 'textFilter'
  }, {
    label: '投用日期',
    prop: 'useDate'
  }, {
    label: '最近检维修日期',
    prop: 'lastMaintenanceDate'
  }],
  operate: {
    width: '90',
    btnList: [
      // 操作栏
      {
        label: '查看',
        prop: 'see',
        type: 'text',
      }
    ]
  }
};
export const governmentDeviceData = {
  showIndex: true, // 是否显示序号
  selectionType: false, // 是否启用选框
  pagination: true, // 是否启用分页
  tableList: [{
    label: '企业名称',
    prop: 'compName'
  }, {
    label: '装置名称编号',
    prop: 'deviceNo'
  }, {
    label: '所属工艺大类',
    prop: 'processCategoryName'
  }, {
    label: '所属工艺细类',
    prop: 'processCategorySubName'
  }, {
    label: '安全仪表系统投用状态位号',
    prop: 'statusTagNo'
  }, {
    label: '安全仪表连锁回路总数',
    prop: 'circuitsTotal'
  }],
  operate: {
    width: '90',
    btnList: [
      // 操作栏
      {
        label: '查看',
        prop: 'see',
        type: 'text',
      }
    ]
  }
};
export const governmentGasLeakDetectionPointData = {
  showIndex: true, // 是否显示序号
  selectionType: false, // 是否启用选框
  pagination: true, // 是否启用分页
  tableList: [{
    label: '企业名称',
    prop: 'compName'
  }, {
    label: '设备名称编号',
    prop: 'deviceNo'
  }, {
    label: '检测气体',
    prop: 'deviceCategory'
  }, {
    label: '设备描述',
    prop: 'deviceDes'
  }],
  operate: {
    width: '90',
    btnList: [
      // 操作栏
      {
        label: '查看',
        prop: 'see',
        type: 'text',
      }
    ]
  }
};
export const governmentMajorHazardInstallationsData = {
  showIndex: true, // 是否显示序号
  selectionType: false, // 是否启用选框
  pagination: true, // 是否启用分页
  tableList: [{
    label: '企业名称',
    prop: 'compName'
  }, {
    label: '储罐位号',
    prop: 'deviceNo'
  }, {
    label: '储罐内介质',
    prop: 'deviceMedia'
  }, {
    label: '储罐类型',
    prop: 'tankType'
  }, {
    label: '罐容积',
    prop: 'tankUnitVolume'
  }, {
    label: '罐高',
    prop: 'tankUnitHeightVolume'
  }, {
    label: '罐径',
    prop: 'tankUnitDiameterVolume'
  }, {
    label: '罐液位最高值',
    prop: 'tankUnitMaximumVolume'
  }, {
    label: '液位',
    prop: 'tankUnitLcVolume'
  }, {
    label: '储量比例',
    prop: 'tankUnitRatioVolume'
  }, {
    label: '温度',
    prop: 'tankUnitTempVolume'
  }, {
    label: '压力',
    prop: 'tankUnitPresVolume'
  }]
};
export const governmentCombustibleToxicGasData = {
  showIndex: true, // 是否显示序号
  selectionType: false, // 是否启用选框
  pagination: true, // 是否启用分页
  tableList: [{
    label: '企业名称',
    prop: 'compName'
  }, {
    label: '设备名称编号',
    prop: 'deviceNo'
  }, {
    label: '设备类别',
    prop: 'deviceCategory'
  }, {
    label: '检测气体',
    prop: 'gasDetection'
  }, {
    label: '浓度',
    prop: 'tinickness'
  }]
};
export const governmentHazardousProcessLeftData = {
  showIndex: true, // 是否显示序号
  selectionType: false, // 是否启用选框
  pagination: true, // 是否启用分页
  tableList: [{
    label: '企业名称',
    prop: 'compName'
  }, {
    label: '设备名称',
    prop: 'deviceNo'
  }, {
    label: '所属工艺',
    prop: 'processCategoryName'
  }, {
    label: '典型工艺装置',
    prop: 'processCategorySubName'
  }]
};
export const governmentMaterielMaterialStatisticsLeftData = {
  showIndex: false, // 是否显示序号
  selectionType: false, // 是否启用选框
  pagination: false, // 是否启用分页
  height: '315',
  tableList: [{
    label: '物料类别',
    prop: 'm1'
  }, {
    label: '实时储量（m³）',
    prop: 'm2'
  }]
};
export const governmentMaterielMaterialStatisticsRightData = {
  showIndex: false, // 是否显示序号
  selectionType: false, // 是否启用选框
  pagination: false, // 是否启用分页
  height: '315',
  tableList: [{
    label: '物料名称',
    prop: 'm1'
  }, {
    label: '实时储量（m³）',
    prop: 'm2'
  }]
};
export const governmentAlarmProcessingData = {
  showIndex: true, // 是否显示序号
  selectionType: false, // 是否启用选框
  pagination: true, // 是否启用分页
  tableList: [{
    label: '企业名称',
    prop: 'compName'
  }, {
    label: '设备类别',
    prop: 'deviceCategory'
  }, {
    label: '设备名称编号',
    prop: 'deviceNo'
  }, {
    label: '指标类型',
    prop: 'keyMonitorParameters'
  }, {
    label: '计量单位',
    prop: 'unit'
  }, {
    label: '低低报',
    prop: 'alarmMinLmt'
  }, {
    label: '高高报',
    prop: 'alarmMaxLmt'
  }, {
    label: '低报',
    prop: 'alarmLowLmt'
  }, {
    label: '高报',
    prop: 'alarmHighLmt'
  }, {
    label: '实时数据',
    prop: 'realTimeData'
  }, {
    label: '最新报警时间',
    prop: 'collectTime'
  }, {
    label: '处理状态',
    prop: 'dealState',
    type: 'dealState'
  }, {
    label: '操作',
    prop: 'handlingAlarms',
    type: 'click',
    isAuthType: true
  }]
};
export const dataAcquisitionInstrumentLeftData = {
  showIndex: true, // 是否显示序号
  selectionType: true, // 是否启用选框
  fixed: 'left',
  pagination: true, // 是否启用分页
  tableList: [{
    label: '设备编号',
    width: '100',
    prop: 'deviceNo'
  }, {
    label: '密码',
    width: '100',
    prop: 'password'
  }, {
    label: 'modbus地址',
    width: '100',
    prop: 'modbusAddress'
  }, {
    label: '所属企业',
    width: '100',
    prop: 'compName'
  }, {
    label: '企业编码',
    width: '100',
    prop: 'compNo'
  }, {
    label: '网关编码',
    width: '100',
    prop: 'gatewayNo'
  }],
  operate: {
    width: '100',
    fixed: 'right',
    btnList: [
      // 操作栏
      {
        label: '编辑',
        prop: 'edit',
        type: 'text',
        // isAuthType: true
      },
      {
        label: '删除',
        prop: 'del',
        type: 'text',
        // isAuthType: true
      }
    ]
  }
};
export const dataAcquisitionInstrumentRightData = {
  showIndex: true, // 是否显示序号
  selectionType: true, // 是否启用选框
  fixed: 'left',
  pagination: true, // 是否启用分页
  tableList: [{
    label: '信道编号',
    width: '100',
    prop: 'channelNo'
  }, {
    label: '通道号',
    width: '100',
    prop: 'ord'
  }, {
    label: '电流上限',
    width: '100',
    prop: 'maxElec'
  }, {
    label: '电流下限',
    width: '100',
    prop: 'minElec'
  }, {
    label: '高高报',
    width: '100',
    prop: 'alarmMaxLmt'
  }, {
    label: '低低报',
    width: '100',
    prop: 'alarmMinLmt'
  }, {
    label: '高报',
    width: '100',
    prop: 'alarmHighLmt'
  }, {
    label: '低报',
    width: '100',
    prop: 'alarmLowLmt'
  }, {
    label: '单位',
    width: '100',
    prop: 'unit'
  }, {
    label: '指标编码',
    width: '100',
    prop: 'indexCode'
  }],
  operate: {
    width: '100',
    fixed: 'right',
    btnList: [
      // 操作栏
      {
        label: '编辑',
        prop: 'edit',
        type: 'text',
        // isAuthType: true
      },
      {
        label: '删除',
        prop: 'del',
        type: 'text',
        // isAuthType: true
      }
    ]
  }
};
export const categoryListData = {
  showIndex: true, // 是否显示序号
  selectionType: true, // 是否启用选框
  pagination: true, // 是否启用分页
  tableList: [{
    label: '类别',
    prop: 'dangerousCategory'
  }, {
    label: '系数',
    prop: 'riskFactor'
  }],
  operate: {
    width: '100',
    btnList: [
      // 操作栏
      {
        label: '编辑',
        prop: 'edit',
        type: 'text',
        // isAuthType: true
      },
      {
        label: '删除',
        prop: 'del',
        type: 'text',
        // isAuthType: true
      }
    ]
  }
};
export const reservesListData = {
  showIndex: true, // 是否显示序号
  selectionType: true, // 是否启用选框
  pagination: true, // 是否启用分页
  tableList: [{
    label: '上限',
    prop: 'riskMax'
  }, {
    label: '下限',
    prop: 'riskMin'
  }, {
    label: '系数',
    prop: 'riskFactor'
  }],
  operate: {
    width: '100',
    btnList: [
      // 操作栏
      {
        label: '编辑',
        prop: 'edit',
        type: 'text',
        // isAuthType: true
      },
      {
        label: '删除',
        prop: 'del',
        type: 'text',
        // isAuthType: true
      }
    ]
  }
};
