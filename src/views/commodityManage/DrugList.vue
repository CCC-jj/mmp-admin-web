<template>
  <div class="DrugList">
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
                <a-input placeholder="输入药品名或药企名" v-model="queryInfo.resName" />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="药品分类" prop="department">
                <a-select v-model="queryInfo.department" placeholder="请选择分类">
                  <a-select-option value="心血管系统用药">
                    心血管系统用药
                  </a-select-option>
                  <a-select-option value="呼吸系统用药">
                    呼吸系统用药
                  </a-select-option>
                  <a-select-option value="皮肤科用药">
                    皮肤科用药
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
            <a-button type="primary" icon="plus" @click="addDoctor">新增医生</a-button>
            <a-button type="danger" icon="delete">删除</a-button>
            <a-button icon="import">批量导入</a-button>
          </a-space>
        </a-col>
        
      </a-row>
    </div>

    <!-- 切换标签 -->
    <div class="tabs">
      <a-tabs default-active-key="1" @change="changeTabs">
        <a-tab-pane key="1" tab="全部">
        </a-tab-pane>
        <a-tab-pane key="2" tab="已上架">
        </a-tab-pane>
        <a-tab-pane key="3" tab="未上架">
        </a-tab-pane>
        <a-tab-pane key="4" tab="审核未通过">
        </a-tab-pane>
      </a-tabs>
    </div>

    <!-- 医生操作抽屉 -->
    <a-drawer width="50%" :title="actionTitle" :visible="actionVisible" :after-visible-change="afterActionVisibleChange" @close="actionOnClose">
      <div v-if="viewVisible">
        <div class="actionBox">
          <div class="title">基本信息</div>
          <a-row type="flex" justify="space-between">
            <div style="flex:2">
              <img style="margin:0 auto;width:100%;margin:10px 0;" src="../../assets/u9183.png" alt="">
            </div>
            <div style="flex:8">
              <a-descriptions :column="2" size="small" bordered>
                <a-descriptions-item label="ID">
                  {{actionForm.id}}
                </a-descriptions-item>
                <a-descriptions-item label="药品名称">
                  {{actionForm.name}}
                </a-descriptions-item>
                <a-descriptions-item label="规格">
                  {{actionForm.specification}}
                </a-descriptions-item>
                <a-descriptions-item label="价格">
                  {{actionForm.price}}
                </a-descriptions-item>
                <a-descriptions-item label="药企">
                  {{actionForm.company}}
                </a-descriptions-item>
                <a-descriptions-item label="库存">
                  {{actionForm.stock}}
                </a-descriptions-item>
                <a-descriptions-item label="是否为处方药">
                  {{actionForm.prescription}}
                </a-descriptions-item>
                <a-descriptions-item label="药品分类">
                  {{actionForm.sort}}
                </a-descriptions-item>
                <a-descriptions-item label="发布时间">
                  {{actionForm.time}}
                </a-descriptions-item>
                <a-descriptions-item label="状态">
                  {{actionForm.status}}
                </a-descriptions-item>
              </a-descriptions>
            </div>
          </a-row>

        </div>
        <div class="actionBox">
          <div class="title">简介</div>
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
      </div>

      <div v-else>
        <div style="padding: 0 35px 25px 35px;">
          <a-form-model ref="actionRuleForm" :model="actionForm" :rules="actionRules" v-bind="{labelCol: { span: 4 }, wrapperCol: { span: 20 }}">
            <a-form-model-item label="药品名称" prop="name">
              <a-input v-model="actionForm.name" placeholder="请输入药品名称" />
            </a-form-model-item>
            <a-form-model-item label="列表图" prop="listPic">
              <a-upload name="avatar" list-type="picture-card" class="avatar-uploader" :show-upload-list="false" action="https://www.mocky.io/v2/5cc8019d300000980a055e76" :before-upload="beforeUpload" @change="uploadHandleChange">
                <img style="max-width:200px;" v-if="actionForm.listPic" :src="actionForm.listPic" alt="avatar" />
                <div v-else>
                  <a-icon :type="uploading ? 'loading' : 'plus'" />
                  <div class="ant-upload-text">
                    Upload
                  </div>
                </div>
              </a-upload>
            </a-form-model-item>
            <a-form-model-item label="是否推荐" prop="recommend">
              <a-radio-group v-model="actionForm.recommend">
                <a-radio value="是">
                  是
                </a-radio>
                <a-radio value="否">
                  否
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="药品分类" prop="sort">
              <a-select v-model="actionForm.sort" placeholder="请选择分类">
                <a-select-option value="心血管系统用药">
                  心血管系统用药
                </a-select-option>
                <a-select-option value="呼吸系统用药">
                  呼吸系统用药
                </a-select-option>
                <a-select-option value="皮肤科用药">
                  皮肤科用药
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="规格" prop="specification">
              <a-input v-model="actionForm.specification" placeholder="请输入规格" />
            </a-form-model-item>
            <a-form-model-item label="价格" prop="price">
              <a-input v-model="actionForm.price" prefix="￥" placeholder="请输入价格" />
            </a-form-model-item>
            <a-form-model-item label="库存" prop="stock">
              <a-input v-model="actionForm.stock" placeholder="请输入库存" />
            </a-form-model-item>
            <a-form-model-item label="是否处方药" prop="prescription">
              <a-radio-group v-model="actionForm.prescription">
                <a-radio value="是">
                  是
                </a-radio>
                <a-radio value="否">
                  否
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="药企" prop="company">
              <a-input v-model="actionForm.company" placeholder="请输入药企" />
            </a-form-model-item>
            <a-form-model-item label="上架" prop="shelf">
              <a-switch v-model="actionForm.shelf"></a-switch>
            </a-form-model-item>
            <a-form-model-item label="详细介绍" prop="introduction">
              <a-textarea v-model="actionForm.introduction" :rows="4" />
            </a-form-model-item>
          </a-form-model>
        </div>

        <div :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }">
          <a-button icon="close-circle" :style="{ marginRight: '8px' }" @click="actionOnClose">
            取消
          </a-button>
          <a-button icon="plus-circle" type="primary" @click="actionOnSave">
            保存
          </a-button>
        </div>
      </div>

    </a-drawer>

    <!-- 菜单表格 -->
    <div class="table">
      <a-table size="middle" :expandIconColumnIndex="2" :loading="tableLoading" bordered :data-source="dataSource" :columns="columns" :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :rowKey="(record, index) => {return record.key}" :pagination="{ showSizeChanger: true, showQuickJumper: true, pageSize: 10, total: 50, current: 1, showTotal: ((total) => {return `共 ${total} 条`}) }">
        <template slot="listPic" slot-scope="text">
          <img style="width:50px;" :src="text" alt="" srcset="">
        </template>
        <template slot="shelf" slot-scope="text,record">
          <a-switch v-model="record.shelf"></a-switch>
        </template>
        <template slot="action" slot-scope="text,record">
          <a-space :size="15">
            <a @click="toView(record)">
              <a-icon type="eye" /> 查看
            </a>
            <a @click="toEdit(record)">
              <a-icon type="edit" /> 编辑
            </a>
            <a-popconfirm title="确定删除吗?" @confirm="() => onDelete(record.key)">
              <a href="javascript:;">
                <a-icon type="delete" /> 删除
              </a>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </div>

  </div>
</template>

<script>
function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
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
    title: '上架',
    dataIndex: 'shelf',
    scopedSlots: { customRender: 'shelf' },
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
    width: '230px',
  },
]
const dataSource = []
for (let i = 0; i < 8; i++) {
  dataSource.push({
    key: i,
    name: '络活喜苯磺酸氨氯地平片',
    listPic:
      'data:image/jpeg;base64,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',
    price: 25,
    stock: 100,
    shelf: true,
    status: '审核通过',
    time: '2020-02-07 21:00:00',
  })
}
export default {
  name: 'DrugList',
  inject: ['reloadCard'],
  data() {
    return {
      // 搜索栏
      search: true,
      queryInfo: {
        resName: '',
        department: undefined,
        job: undefined,
      },
      queryRules: {},
      // 表格
      tableLoading: false,
      columns,
      dataSource,
      selectedRowKeys: [],
      // 操作
      actionTitle: '新增药品',
      actionVisible: false,
      actionForm: {
        name: '',
        listPic: '',
        recommend: undefined,
        sort: undefined,
        specification: '',
        price: '',
        stock: '',
        prescription: undefined,
        company: '',
        shelf: true,
        introduction: '',
        id: '',
        time: '',
      },
      actionRules: {
        name: [{ required: true, message: '请输入药品名称', trigger: 'blur' }],
        listPic: [{ required: true, message: '请上传列表图', trigger: 'change' }],
        recommend: [{ required: true, message: '请选择是否推荐', trigger: 'change' }],
        sort: [{ required: true, message: '请选择药品分类', trigger: 'change' }],
        specification: [{ required: true, message: '请输入规格', trigger: 'blur' }],
        price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        stock: [{ required: true, message: '请输入库存', trigger: 'blur' }],
        prescription: [{ required: true, message: '请选择是否处方药', trigger: 'change' }],
        company: [{ required: true, message: '请输入药企', trigger: 'blur' }],
        shelf: [{ required: true, message: '请选择是否上架', trigger: 'change' }],
        introduction: [{ required: true, message: '请输入详细介绍', trigger: 'blur' }],
      },

      // 上传图片
      uploading: false,
      // 查看详情
      viewVisible: false,
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
      if (!val) {
        this.viewVisible = false
      }
    },
    actionOnClose() {
      this.actionVisible = false
      this.actionForm = this.$options.data().actionForm
    },
    actionOnSave() {
      this.$refs.actionRuleForm.validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 上传图片
    uploadHandleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (imageUrl) => {
          console.log(imageUrl)
          this.actionForm.listPic = imageUrl
          this.loading = false
        })
      }
    },
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!')
      }
      return isJpgOrPng && isLt2M
    },
    // 查看医生详情
    toView(record) {
      console.log(record)
      this.actionForm = record
      this.actionTitle = '医生详情'
      this.actionVisible = true
      this.viewVisible = true
    },
    // 编辑
    toEdit(record) {
      this.actionForm = record
      this.actionTitle = '编辑药品'
      this.actionVisible = true
    },
  },
}
</script>

<style lang="less" scoped>
@keyframes mask-in {
  0% {
    height: 0;
  }
  100% {
    height: 65px;
  }
}
.mask-enter-active {
  animation: mask-in 0.2s linear;
}
.mask-leave-active {
  animation: mask-in 0.2s reverse linear;
}
.DrugList {
  background: #fff;
  padding: 24px;
  .search {
    height: 65px;
    overflow: hidden;
  }
}
.actionBox {
  border: 1px solid #eee;
  margin-bottom: 10px;
  // padding: 5px;
  .title {
    font-size: 16px;
    background: rgb(250, 250, 250);
    padding: 10px;
  }
}
</style>