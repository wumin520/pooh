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

// Report Types
export const LW = 'LW' // 最近7天
export const L60D = 'L60D' // 最近60天
export const L90D = 'L90D' // 最近60天

export const URI_FETCH_NEW_PRE = '/v2/api/task/new' // 新加广告 前的相关信息
export const URI_POST_TASK = '/v2/api/task/'  // 提交广告

export const URI_FETCH_EDIT_PRE = '/v2/api/task/edit/'  // 编辑的任务信息
export const URI_FETCH_RENEW_PRE = '/v2/api/task/copy/'  // 续单的任务信息
