export const tableOption = {
  "border": true,
  "index": true,
  "indexLabel": "序号",
  "stripe": true,
  "menuAlign": "center",
  "align": "center",
  "searchMenuSpan": 6,
  "viewBtn": true,
  "excelBtn": true,
  "editBtnText": "处 理",
  "delBtn": false,
  "searchBtn": true,
  "searchBtnText": "搜索",
  "column": [
    {
      "type": "input",
      "label": "主键",
      "prop": "id",
      "addDisplay": false,
      "editDisabled": true,
      "editDisplay": false,
      // "search":true
    },
    {
      "type": "input",
      "label": "所属单位",
      "prop": "orderby",
      "readonly": true
    },
    {
      "type": "input",
      "label": "责任人",
      "readonly": true,
      "prop": "responsePeople"
    },
    {
      "type": "input",
      "label": "设备名称",
      "prop": "deviceName",
      "readonly": true
    },
    {
      "type": "input",
      "label": "外出地点",
      "prop": "outLocation",
      "readonly": true
    },
    {
      "type": "input",
      "label": "违法时间",
      "prop": "illegalTime",
      "readonly": true
    },
    {
      "type": "input",
      "label": "视频文件",
      "prop": "videoFile",
      "readonly": true
    },
    {
      "type": "video",
      "label": "视频预览",
      "prop": "videoFile",
      "addDisplay": false,
    },
    {
      "type": "select",
      "label": "违法行为",
      "prop": "illegalAction",
      "dicUrl": '/admin/dict/type/zfjd_illegal_action'
    },
    {
      "type": "input",
      "label": "创建时间",
      "prop": "createTime",
      "addDisplay": false,
      "editDisabled": true,
      "editDisplay": false
    },
    {
      "type": "input",
      "label": "创建人",
      "prop": "createBy",
      "addDisplay": false,
      "editDisabled": true,
      "editDisplay": false
    },
    {
      "type": "input",
      "label": "修改时间",
      "prop": "updateTime",
      "addDisplay": false,
      "editDisabled": true,
      "editDisplay": false
    },
    {
      "type": "input",
      "label": "更新人",
      "prop": "updateBy",
      "addDisplay": false,
      "editDisabled": true,
      "editDisplay": false
    },
    {
      "type": "select",
      "label": "状态",
      "prop": "status",
      "dicUrl": '/admin/dict/type/zfjd_status',
      "editDisplay": false
    },
    {
      "type": "input",
      "label": "案件号",
      "prop": "caseNo",
      "editDisplay": false
    },
    {
      "type": "input",
      "label": "案件时间",
      "prop": "caseTime",
      "editDisplay": false
    },
    {
      "type": "input",
      "label": "案件名称",
      "prop": "caseName",
      "editDisplay": false
    },
    {
      "type": "input",
      "label": "案件类型",
      "prop": "caseType",
      "editDisplay": false
    },
    {
      "type": "input",
      "label": "立案机关",
      "prop": "caseOrgan",
      "editDisplay": false
    },
    {
      "type": "input",
      "label": "违法开始时间",
      "prop": "illegalStartTime",
      "readonly": true
    },
    {
      "type": "input",
      "label": "违法结束时间",
      "prop": "illegalEndTime",
      "readonly": true
    }
  ]
}
