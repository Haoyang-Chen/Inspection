const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  logging: state => state.user.logging,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  permission_routes: state => state.permission.sideRoutes,
  ifAdmin: state =>state.user.ifAdmin,
  deptId: state =>state.user.deptId,
  area: state => state.user.area,
  positionName:state =>state.common.positionName, //岗位名称
  personSexList:state =>state.common.personSexList, //男，女
  personTypeList:state =>state.common.personTypeList, //人员类型
  highestEducationList:state =>state.common.highestEducationList, //学历
  trueFalseList:state =>state.common.trueFalseList, //是 否
  whetherJob:state =>state.common.whetherJob, //在职-离职
  ExpiredList:state =>state.common.ExpiredList, //已过期，未过期,
  certificateTypeList:state =>state.common.certificateTypeList, //已过期，未过期
  DocumentsState:state =>state.common.DocumentsState, //草稿-已评审-已废止
  userStatus:state =>state.common.userStatus, //草稿-已评审-已废止
  workTypes:state =>state.common.workTypes, //特种操作种类
  workTypes01:state =>state.common.workTypes01, //特种操作种类
}

export default getters
