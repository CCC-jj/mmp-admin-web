<template>
  <div class="contentBox">
    <!-- 搜索栏 -->
    <div style="float:right;">
      <a-space>
        <a-tooltip title="刷新">
          <a-button shape="circle" icon="reload" @click="refresh" />
        </a-tooltip>
        <a-tooltip title="搜索">
          <a-button shape="circle" icon="search" @click="showSearch" />
        </a-tooltip>
      </a-space>
    </div>
    <transition name="mask">
      <div class="search" v-show="search">
        <a-form-model ref="queryRuleForm" :model="queryInfo" :rules="queryRules" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" @keyup.enter.native="onSubmit">
          <a-row>
            <a-col :span="6">
              <a-form-model-item label="菜单名称" prop="resName">
                <a-input placeholder="菜单名称" v-model="queryInfo.resName" />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="药品分类" prop="sort">
                <a-select v-model="queryInfo.sort" placeholder="请选择药品分类" @change="handleDrugSortChange">
                  <a-select-option v-for="item in drugSortData" :key="item">
                    {{item}}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="" prop="job">
                <a-select v-model="childDrugSort" placeholder="请选择药品分类">
                  <a-select-option v-for="item in drugSort" :key="item">
                    {{item}}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item :wrapper-col="{ span: 24, offset: 4 }">
                <a-button style="margin-right:20px;" type="primary" icon="search" @click="onSubmit">
                  搜索
                </a-button>
                <a-button icon="delete" @click="resetForm">
                  清空
                </a-button>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </transition>

    <!-- 操作按钮 -->
    <div class="operationButton" style="margin-bottom:20px;">
      <a-row type="flex" justify="space-between">
        <a-col>
          <a-space>
            <!-- <a-button type="primary" icon="plus" @click="addDoctor">新增医生</a-button> -->
            <a-button type="danger" icon="delete">批量删除</a-button>
            <!-- <a-button icon="import">批量导入</a-button> -->
          </a-space>
        </a-col>

      </a-row>
    </div>

    <!-- 切换标签 -->
    <!-- <div class="tabs">
      <a-tabs default-active-key="1" @change="changeTabs">
        <a-tab-pane key="1" tab="全部">
        </a-tab-pane>
        <a-tab-pane key="2" tab="审核通过">
        </a-tab-pane>
        <a-tab-pane key="3" tab="审核未通过">
        </a-tab-pane>
      </a-tabs>
    </div> -->

    <!-- 医生操作抽屉 -->
    <a-drawer width="50%" :title="actionTitle" :visible="actionVisible" :after-visible-change="afterActionVisibleChange" @close="actionOnClose">
      <a-row style="margin-bottom: 10px;">
        <a-col type="flex" justify="flex-end">
          <a-button style="float:right;" @click="toCheck(actionInfo)">审核</a-button>
        </a-col>
      </a-row>

      <div class="actionBox">
        <div class="actionBox-title">基本信息</div>
        <a-row type="flex" justify="space-between">
          <div style="flex:2">
            <img style="margin:0 auto;width:100%;margin:10px 0;" src="../../assets/img/u9183.png" alt="">
          </div>
          <div style="flex:8">
            <a-descriptions :column="2" size="small" bordered>
              <a-descriptions-item label="ID">
                {{actionInfo.id}}
              </a-descriptions-item>
              <a-descriptions-item label="药品名称">
                {{actionInfo.name}}
              </a-descriptions-item>
              <a-descriptions-item label="规格">
                {{actionInfo.specification}}
              </a-descriptions-item>
              <a-descriptions-item label="价格">
                {{actionInfo.price}}
              </a-descriptions-item>
              <a-descriptions-item label="药企">
                {{actionInfo.company}}
              </a-descriptions-item>
              <a-descriptions-item label="库存">
                {{actionInfo.stock}}
              </a-descriptions-item>
              <a-descriptions-item label="是否为处方药">
                {{actionInfo.prescription}}
              </a-descriptions-item>
              <a-descriptions-item label="药品分类">
                {{actionInfo.sort}}
              </a-descriptions-item>
              <a-descriptions-item label="发布时间">
                {{actionInfo.time}}
              </a-descriptions-item>
              <a-descriptions-item label="状态">
                {{actionInfo.status}}
              </a-descriptions-item>
            </a-descriptions>
          </div>
        </a-row>

      </div>
      <div class="actionBox">
        <div class="actionBox-title">简介</div>
        <div style="padding:24px;">
          <p>【药品名称】</p>
          <p>通用名：苯磺酸氨氯地平</p>
          <p>英文商品名：Norvasc</p>
          <p>【成份】</p>
          <p>本品主要成份为苯磺酸氨氯地平，其化学名称为：3-乙基-5-甲基-2-(2-氨基乙氧甲基)-4-(2-氯苯基)-1，4-二氢-6-甲基-3， 5-吡啶二羧酸酯苯磺酸盐。

            化学结构式：

            分子式：C20H25N2O5Cl⋅C6H6O3S

            分子量：567.1</p>
          <p>【性状】</p>
          <p>本品为白色片</p>
          <p></p>
          <p>【适应症】</p>
        </div>

      </div>
    </a-drawer>

    <!-- 菜单表格 -->
    <div class="table">
      <a-table size="middle" :expandIconColumnIndex="2" :loading="tableLoading" bordered :data-source="dataSource" :columns="columns" :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :rowKey="(record, index) => {return record.key}" :pagination="{ showSizeChanger: true, showQuickJumper: true, pageSize: 10, total: 50, current: 1, showTotal: ((total) => {return `共 ${total} 条`}) }">
        <template slot="listPic" slot-scope="text">
          <img style="height:40px;" :src="text" alt="" srcset="">
        </template>
        <template slot="action" slot-scope="text,record">
          <a-space :size="15">
            <a @click="toView(record)">
              <a-icon type="eye" /> 查看
            </a>
            <a @click="toCheck(record)">
              <a-icon type="edit" /> 审核
            </a>
            <!-- <a-popconfirm title="确定删除吗?" @confirm="() => onDelete(record.key)">
              <a href="javascript:;">
                <a-icon type="delete" /> 删除
              </a>
            </a-popconfirm> -->
          </a-space>
        </template>
      </a-table>
    </div>

    <a-modal :zIndex="1001" v-model="checkVisible" title="医生审核" @ok="checkHandleOk">
      <p>姓名： {{checkInfo.name}}</p>
      <p>审核：
        <a-radio-group v-model="checkInfo.result">
          <a-radio value="审核通过">
            审核通过
          </a-radio>
          <a-radio value="审核不通过">
            审核不通过
          </a-radio>
        </a-radio-group>
      </p>
      <p>备注：
        <a-textarea v-model="checkInfo.remark" :rows="4" />
      </p>
    </a-modal>

  </div>
</template>

<script>
const columns = [
  // {
  //   title: '#',
  //   align: 'center',
  //   customRender: (text, record, index) => `${index + 1}`,
  //   width: '60px',
  // },
  {
    title: '药品名称',
    dataIndex: 'name',
  },
  {
    title: '列表图',
    dataIndex: 'listPic',
    scopedSlots: { customRender: 'listPic' },
  },
  {
    title: '价格',
    dataIndex: 'price',
  },
  {
    title: '状态',
    dataIndex: 'shelf',
  },
  {
    title: '审核状态',
    dataIndex: 'status',
  },
  {
    title: '库存',
    dataIndex: 'stock',
  },
  {
    title: '发布时间',
    dataIndex: 'time',
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' },
    align: 'center',
    width: '180px',
  },
]
const dataSource = []
for (let i = 0; i < 8; i++) {
  dataSource.push({
    key: i,
    name: '络活喜苯磺酸氨氯地平片',
    listPic:
      'data:image/png;base64,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UqPsvxtls75AZtAe3iVSMa2q3NlstKCIMTFmUMkp6uhs88bMvC5dNGlvkE32OWmozwl0WYH02/99vv3vT3/m+zpo5K95zWvsV1de7mOMhx9+xDpau/T+Ynvekc/zSmYW5L77HtCA8VClh21esEn1OMK5d6sokB//+McyZa61q6++1p71rMP13gafc37Xu95tL3jBcdKgu9hFF33fTjrpZPvnf/4Xt3+//e3vuHZ92Utf6ibEoC+sTNj9999vL3zhC93W//d//3efnYFP4p533nn2d3/3dz6DgQnxpS99yXujb3/72z4ld8B++9vJJ79YeR7vPcjSpbvJnDhO+Z4i5ba/879q1WqfuyYO33cefuSh3gBZKXXNsM2kuvGVQPkyIeoybIVgRZCBINtDw/aAAFPZzoZNDegDETusFjqMnTJjSbdN90BXxgYlukEE4CDfCjU25yxfmLB+DVrGlNQfbrpR2rxO3UedHXrYIXbBhefbTjvPk9a+34495gi7566bbXDtSjvx+OfbA/eutrM/fqa97G9eaUsWSQusuNte8Pzn2PL777DXvPav7OWnv8Ruu/1mq8/W+zLxeeedq1H8frJz5yivYdtpl50EWRU4afFOM2iELVPZ7Wds4L7+De4YGHZpUHLiicdpcPRZe+c7327PPeoI65nTZa/729fa+d/6L/ukxgpMjwGYww7TWOAlL/Uu+J577rPdl+1tH/vY2QLps+3WW263vr5+H70DIhZFWBpHYXz6U5+1ZbvtYa9+9avd/kWrMWPwMTVqbF4GeK9//evthz/8od1+++3etTPIo5yYDWFhZb3PLhx99NE+54zWZcBHPRL/ox/9qGtjFBMDP9L67//+bwczcUiD8Di7g0lD3gCd5xEDNCaujzrqKG9ADz+43p8jYzRzlHWlDkSPTf6B0u/HNAib6RriekvpNzCS5DwNNsmzAee5z32u3sj66Jm5ytmIJAfVvT+6fp01d7TZfRpAXXXN1fYiDfaef8zRbpsuWNBsb3/rh5VmyRbO69EI/0JbuGSBdbbn7IPv+0drVZt5yUnMXgzaIw+vsDcI3A89eJ9951vf8gpknvfIo4+w7l7ZkGo4GbXS6274nTU0NdjqO241W7TYeZkuDCgthC1RNpex3ZYt9pFyZ1erjyMeXbPalizdxcECSJjaotIZVDHZv+vSZV7Bjz661rXe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',
    price: 25,
    stock: 100,
    shelf: '未上架',
    status: '审核通过',
    time: '2020-02-07 21:00:00',
  })
}
const drugSortData = ['心血管系统用药', '呼吸系统用药', '皮肤科用药']
const childDrugSortData = {
  心血管系统用药: ['钙通道阻滞用药', '慢性心功能不全', '抗心律失常药'],
  呼吸系统用药: ['镇咳药', '祛痰药', '平喘药'],
  皮肤科用药: ['镇咳药', '祛痰药', '平喘药'],
}
export default {
  name: 'DrugCheck',
  inject: ['reloadCard'],
  data() {
    return {
      // 搜索栏
      search: true,
      queryInfo: {
        resName: '',
        sort: undefined,
        job: undefined,
      },
      queryRules: {},
      drugSortData,
      childDrugSortData,
      drugSort: childDrugSortData[drugSortData[0]],
      childDrugSort:  childDrugSortData[drugSortData[0]][0],
      // 表格
      tableLoading: false,
      columns,
      dataSource,
      selectedRowKeys: [],
      // 操作医生
      actionTitle: '新增医生',
      actionVisible: false,
      actionInfo: {
        id: '01',
        name: '赵霞络活喜苯磺酸氨氯地平片',
        specification: '5mg*7片/盒',
        price: '￥25',
        company: '辉瑞制药有限公司',
        stock: '100',
        prescription: '是',
        sort: '心血管系统用药>降压药',
        time: '2020-02-07 21：00：00',
        status: '待审核',
      },
      // 查看医生详情
      viewVisible: false,
      // 审核
      checkVisible: false,
      checkInfo: {
        name: '',
        result: '审核通过',
        remark: '',
      },
    }
  },
  methods: {
    // 搜索栏
    onSubmit() {
      this.$refs.queryRuleForm.validate((valid) => {
        if (valid) {
          alert('1')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.queryRuleForm.resetFields()
    },
    handleDrugSortChange(value) {
      this.drugSort = childDrugSortData[value];
      this.childDrugSort = childDrugSortData[value][0];
    },
    // 新增医生
    addDoctor() {
      this.actionTitle = '新增医生'
      this.actionVisible = true
      this.viewVisible = false
    },
    refresh() {
      this.reloadCard()
    },
    showSearch() {
      this.search = !this.search
    },
    changeTabs(key) {
      console.log(key)
    },
    // 表格
    // 勾选表单数据
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    // 操作抽屉
    afterActionVisibleChange(val) {
      console.log('visible', val)
    },
    actionOnClose() {
      this.actionVisible = false
    },
    // 查看医生详情
    toView(record) {
      console.log(record)
      this.actionTitle = '医生详情-待审核'
      this.actionVisible = true
      this.viewVisible = true
    },
    // 审核
    toCheck(record) {
      console.log(record)
      this.checkInfo = record
      this.checkVisible = true
    },
    checkHandleOk() {
      this.checkVisible = false
      console.log(this.checkInfo)
    },
  },
}
</script>

<style lang="less" scoped>
.contentBox {
  .search {
    height: 65px;
  }
}
</style>