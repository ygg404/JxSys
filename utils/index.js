var app = getApp();
/**
 * 第一个跳转的页面
 */
function firstLoad(){
  let permissionsList = app.globalData.permissions;
  if (permissionsList.indexOf('all_permission') != -1){
    return 'project-management';
  }
  if(permissionsList.indexOf('project_schedule') != -1)
  {
    return 'schedule-management'
  }
  if(permissionsList.indexOf('start_project') != -1){
    return 'project-output'
  }
  if(permissionsList.indexOf('get_recycler') != -1){
    return 'recycle-management'
  }
  if(permissionsList.indexOf('project_contract') != -1){
    return 'contract-management'
  }
  if(permissionsList.indexOf('put_project') != -1){
    return 'projectsetup-management'
  }
  if(permissionsList.indexOf('make_project') != -1){
    return 'allocation-management'
  }
  if(permissionsList.indexOf('start_project') != -1){
    return 'projectwork-management'
  }
  if(permissionsList.indexOf('inspect_quality') != -1){
    return 'quality-management'
  }
  if(permissionsList.indexOf('adjust_output') != -1){
    return 'output-management'
  }
  if(permissionsList.indexOf('leader_authorize') != -1){
    return 'authorize-management'
  }
  if(permissionsList.indexOf('authorized') != -1){
    return 'audited-management'
  }
}

module.exports = {
  firstLoad: firstLoad
}