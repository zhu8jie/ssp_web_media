import Main from '@/components/main/main'

/**
 * 项目中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  targetHighLight: (false) 目标父级高亮
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
	{
		path: '/account/login', // 登录
		name: 'login',
		meta: {
			title: '登录',
			hideInMenu: true
		},
		component: resolve => require(['@/view/account/login'], resolve)
	},
	{
		path: '/account/adminLogin', // 管理平台伪登录
		name: 'adminLogin',
		meta: {
			title: '登录',
			hideInMenu: true
		},
		component: resolve => require(['@/view/account/adminLogin'], resolve)
	},
	{
		path: '/account/reg', // 注册
		name: 'register',
		meta: {
			title: '注册',
			hideInMenu: true
		},
		component: resolve => require(['@/view/account/register'], resolve)
	},
	{
		path: '/account/developer', // 开发者协议
		name: 'developer',
		meta: {
			title: '开发者协议',
			hideInMenu: true
		},
		component: resolve => require(['@/view/account/developer'], resolve)
	},
	{
		path: '/',
		name: 'home',
		redirect: '/home',
		component: Main,
		meta: {
			title: '首页',
			redirectTo: 'home-index',
			icon: 'icon-home'
		},
		children: [
			{
				path: '/home',
				name: 'home-index',
				meta: {
					title: '首页'
				},
				component: resolve => require(['@/view/home/index'], resolve)
			}
		]
	},
	{
		path: '/ssp', // 流量管理
		name: 'ssp',
		component: Main,
		meta: {
			title: '流量管理',
			icon: 'icon-traffic'
		},
		children: [
			{
				path: '/ssp/app/manage',
				name: 'app-manage',
				meta: {
					title: '应用管理'
				},
				component: resolve => require(['@/view/ssp/app-manage'], resolve)
			},
			{
				path: '/ssp/app/edit',
				name: 'app-edit',
				meta: {
					hideInMenu: true,
					targetHighLight: 'app-manage',
					title: '新建/编辑应用'
				},
				component: resolve => require(['@/view/ssp/app-edit'], resolve)
			},
			{
				path: '/ssp/ad/manage',
				name: 'ad-manage',
				meta: {
					title: '广告位管理'
				},
				component: resolve => require(['@/view/ssp/ad-manage'], resolve)
			},
			{
				path: '/ssp/ad/edit',
				name: 'ad-edit',
				meta: {
					hideInMenu: true,
					targetHighLight: 'ad-manage',
					title: '新建/编辑广告位'
				},
				component: resolve => require(['@/view/ssp/ad-edit'], resolve)
			}
		]
	},
	{
		path: '/data', // 数据收益
		name: 'revenue',
		redirect: '/data/revenue',
		component: Main,
		meta: {
			title: '数据收益',
			redirectTo: 'revenue-index',
			icon: 'icon-earning'
		},
		children: [
			{
				path: '/data/revenue',
				name: 'revenue-index',
				meta: {
					title: '数据收益'
				},
				component: resolve => require(['@/view/revenue/index'], resolve)
			}
		]
	},
	{
		path: '/finance', // 结算中心
		name: 'finance',
		redirect: '/finance/manage',
		component: Main,
		meta: {
			title: '结算中心',
			redirectTo: 'finance-index',
			icon: 'icon-finance'
		},
		children: [
			{
				path: '/finance/manage',
				name: 'finance-index',
				meta: {
					title: '结算中心'
				},
				component: resolve => require(['@/view/finance/manage'], resolve)
			}
		]
	},
	{
		path: '/infro', // 账户管理
		name: 'infroManage',
		component: Main,
		meta: {
			title: '账户管理',
			icon: 'icon-acount-manage'
		},
		children: [
			{
				path: '/infro/account',
				name: 'infroAccout',
				meta: {
					title: '账户信息'
				},
				component: resolve => require(['@/view/infro/account'], resolve)
			},
			{
				path: '/infro/finance',
				name: 'infroFinance',
				meta: {
					title: '财务信息'
				},
				component: resolve => require(['@/view/infro/finance'], resolve)
			},
			{
				path: '/infro/change_psw',
				name: 'changePsw',
				meta: {
					title: '修改密码'
				},
				component: resolve => require(['@/view/infro/change_psw'], resolve)
			}
		]
	},
	{
		path: '/access', // 接入中心
		name: 'access',
		component: Main,
		redirect: '/access/manage',
		meta: {
			title: '接入中心',
			redirectTo: 'accessManage',
			icon: 'icon-access'
		},
		children: [
			{
				path: '/access/manage',
				name: 'accessManage',
				meta: {
					title: '接入中心'
				},
				component: resolve => require(['@/view/access/index'], resolve)
			},
			{
				path: '/access/log/:access_type',
				name: 'accessLog',
				meta: {
					hideInMenu: true,
					title: '更新日志'
				},
				component: resolve => require(['@/view/access/log'], resolve)
			}
		]
	},
	{
		path: '/notice', // 通知中心
		name: 'notice',
		component: Main,
		redirect: '/notice/manage',
		meta: {
			hideInMenu: true,
			title: '通知中心',
			redirectTo: 'noticeManage',
			icon: 'ios-megaphone'
		},
		children: [
			{
				path: '/notice/manage',
				name: 'noticeManage',
				meta: {
					title: '通知中心'
				},
				component: resolve => require(['@/view/notice/index'], resolve)
			}
		]
	},
	{
		path: '*', // 404
		name: 'noFound',
		meta: {
			hideInMenu: true,
			title: '错误'
		},
		component: resolve => require(['@/view/error/index'], resolve)
	}
]
