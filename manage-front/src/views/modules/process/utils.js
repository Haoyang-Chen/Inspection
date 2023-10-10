/**
 * 不同检测类别的检测项目
 * @param {String} type 检测类别
 */
 export function warnItems(type) {
    if (type === '报告类')
      return [{
        label: '应急预案备案',
        value: 1
      }, {
        label: '重大危险源评估',
        value: 2
      }, {
        label: '安全现状评价备案',
        value: 3
      }, {
        label: '沉降位移检测',
        value: 4
      }]
    else if (type === '电仪类')
      return [{
        label: '防雷装置与防静电接地检测',
        value: 1
      }, {
        label: '建筑电气消防安全年度检测',
        value: 2
      }, {
        label: '电气防爆安全检测',
        value: 3
      }, {
        label: '电气工具检测',
        value: 4
      }, {
        label: '可燃（有毒）气体报警系统检测',
        value: 5
      }, {
        label: '压力表检测',
        value: 6
      }, {
        label: '可燃气体报警系统检查',
        value: 7
      }]
    else if (type === '公司资质类')
      return [{
        label: '排污许可证',
        value: 1
      }, {
        label: '危险化学品经营许可证',
        value: 2
      }, {
        label: '港口经营许可证',
        value: 3
      }, {
        label: '危险货物作业附证',
        value: 4
      }, {
        label: '营业执照',
        value: 5
      }, {
        label: '安全标准化等级证书',
        value: 6
      }]
    else if (type === '环保类')
      return [{
        label: 'LDAR检测',
        value: 1
      }]
    else if (type === '设备类')
      return [{
        label: '呼吸器用复合气瓶检测',
        value: 1
      }, {
        label: '安全阀检测',
        value: 2
      }, {
        label: '压力容器检验',
        value: 3
      }, {
        label: '常压容器检验',
        value: 4
      }, {
        label: '压力管道检验',
        value: 5
      }, {
        label: '常压容器年度检查',
        value: 6
      }, {
        label: '压力容器年度检查',
        value: 7
      }, {
        label: '压力管道年度检查',
        value: 8
      }, {
        label: '地磅检测',
        value: 9
      }, {
        label: '火花熄灭器检查',
        value: 10
      }]
    else if (type === '消防类')
      return [{
        label: '建筑消防设施年度检测',
        value: 1
      }, {
        label: '灭火器检修',
        value: 2
      }, {
        label: '泡沫液检测',
        value: 3
      }, {
        label: '气防工具',
        value: 4
      }, {
        label: '消防评估',
        value: 5
      }, {
        label: '火灾报警按钮检查',
        value: 6
      }]
    else if (type === '职业卫生类')
      return [{
        label: '职业危害因素检测',
        value: 1
      }, {
        label: '职业病体验',
        value: 2
      }, {
        label: '职业危害申报',
        value: 3
      }]
    else return []
  }
  