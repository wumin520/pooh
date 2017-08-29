// API uri
export const URI_REGISTER = '/v2/api/register'
export const URI_LOGIN = '/v2/api/login'
export const URI_LOGOUT = '/v2/api/logout'
export const URI_DASHBOARD = '/v2/api/dashboard'
export const URI_REPORT = '/v2/api/report'
export const URI_REPORT_DOWNLOAD = '/v2/api/report/download'
export const URI_ACCOUNTSETTING = '/v2/api/account'
export const URI_CHARGE_INVOICE = '/v2/api/charge/get_invoice'
export const URI_CHARGE_EDIT = '/v2/api/charge_edit/'
export const URI_CHARGE = '/v2/api/charge'
export const URI_FINANCE = '/v2/api/finance'
export const URI_FINANCE_CHARGE_CANCEL = '/v2/api/cancel/'
export const URI_PRICE_SYS = '/v2/api/charge/get_price_system'
export const URI_BIND_MOBILE = '/v2/api/mobile/bind'
export const URI_VALIDATE_MOBILE = '/v2/api/mobile/check_code'
export const URI_SEND_CHECKCODE = '/v2/api/mobile/send_code'
export const URI_CHECK_APPID = '/v2/api/task/check_appid'

// Report Types
export const LW = 'LW' // 最近7天
export const L30D = 'L30D' // 最近30天
export const L90D = 'L90D' // 最近60天

export const URI_TASK_TO_END = '/v2/api/task/end/' // 任务状态变成 ‘完成’
export const URI_ADD_TASK_NUMBER = '/v2/api/task/' // 续总数、下载idfa
export const URI_PREVIEW_TASK = '/v2/api/task/view/' // 预览
export const URI_DELE_TASK = '/v2/api/task/delete/' // 预览,
export const URI_RESUME_TASK = '/v2/api/task/resume/' // 重新开启任务,

export const URI_FETCH_NEW_PRE = '/v2/api/task/new' // 新加广告 前的相关信息
export const URI_POST_TASK = '/v2/api/task'  // 提交广告

export const URI_FETCH_EDIT_PRE = '/v2/api/task/edit/'  // 编辑的任务信息
export const URI_FETCH_RENEW_PRE = '/v2/api/task/copy/'  // 续单的任务信息
