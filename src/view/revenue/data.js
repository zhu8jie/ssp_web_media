export const getCols = (self) => {
    return [
        {
            title: '日期',
            width: 150,
            key: 'date',
            align: 'center',
            sortable: 'custom',
            isShow: true
        },
        {title: '应用名称/ID', slot: 'app_id', minWidth: 100},
        {title: '广告位名称/ID', slot: 'ssp_slot_id', minWidth: 120},
        {title: '广告位类型', slot: 'creative_type', minWidth: 110},
        {
            title: '广告展现',
            align: 'center',
            key: 'show_pv',
            sortable: 'custom',
            minWidth: 100,
            isShow: true
        },
        {
            title: '广告点击',
            align: 'center',
            key: 'click_pv',
            sortable: 'custom',
            minWidth: 100,
            isShow: true
        },
        {
            title: '点击率',
            align: 'center',
            key: 'ctr',
            sortable: 'custom',
            minWidth: 90,
            isShow: true
        },
        {
            title: '千次展现收益',
            align: 'center',
            key: 'ecpm',
            sortable: 'custom',
            minWidth: 130,
            isShow: true
        },
        {
            title: '单次点击收益',
            align: 'center',
            key: 'cpc',
            sortable: 'custom',
            minWidth: 130,
            isShow: true

        },
        {
            title: '预估收益',
            align: 'center',
            key: 'spend',
            sortable: 'custom',
            minWidth: 100,
            isShow: true
        }
    ]
}
