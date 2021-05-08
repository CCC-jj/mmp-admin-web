<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <template v-if="advanced">
              <a-col :md="6" :sm="24">
                <a-form-item label="医生姓名">
                  <a-input v-model="queryParam.name" placeholder="请输入医生姓名或账号" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="科室">
                  <a-select v-model="queryParam.department" placeholder="请选择科室">
                    <a-select-option value="内分泌科">
                      内分泌科
                    </a-select-option>
                    <a-select-option value="内科">
                      内科
                    </a-select-option>
                    <a-select-option value="消化科">
                      消化科
                    </a-select-option>
                    <a-select-option value="儿科">
                      儿科
                    </a-select-option>
                    <a-select-option value="中医科">
                      中医科
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :md="6" :sm="24">
                <a-form-item label="职称">
                  <a-select v-model="queryParam.job" placeholder="请选择职称" default-value="0">
                    <a-select-option value="主任医师">
                      主任医师
                    </a-select-option>
                    <a-select-option value="副主任医师">
                      副主任医师
                    </a-select-option>
                    <a-select-option value="主治医师">
                      主治医师
                    </a-select-option>
                    <a-select-option value="住院医师">
                      住院医师
                    </a-select-option>
                    <a-select-option value="药剂师">
                      药剂师
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="advanced && 6 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="{ float: 'right', overflow: 'hidden' }">
                <template v-if="advanced">
                  <a-button v-action:query type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                  <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                </template>

                <a-space style="margin-left: 20px">
                  <a-tooltip title="刷新">
                    <a-button shape="circle" icon="reload" @click="reloadCard()" />
                  </a-tooltip>
                  <a-tooltip title="搜索">
                    <a-button shape="circle" icon="search" @click="toggleAdvanced" />
                  </a-tooltip>
                </a-space>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button v-action:delete type="danger" icon="delete">删除</a-button>
      </div>

      <!-- 切换标签 -->
      <div class="tabs">
        <a-tabs default-active-key="1" @change="changeTabs">
          <a-tab-pane key="1" tab="全部">
          </a-tab-pane>
          <a-tab-pane key="2" tab="审核通过">
          </a-tab-pane>
          <a-tab-pane key="3" tab="审核未通过">
          </a-tab-pane>
        </a-tabs>
      </div>

      <s-table ref="table" size="default" rowKey="key" :columns="columns" :data="loadData" :rowSelection="rowSelection" showPagination="auto" :pagination="{ showQuickJumper: true, current: 1, showTotal: ((total) => {return `共 ${total} 条`}) }">
        <span slot="action" slot-scope="text, record">
          <template>
            <a-space size="middle">
              <a v-action:get @click="toView(record)">
                <a-icon type="eye" />查看
              </a>
              <a v-action:edit @click="handleEdit(record)">
                <a-icon type="edit" />审核
              </a>
              <a-popconfirm title="确定删除吗?" @confirm="() => handleSub(record)">
                <a v-action:delete>
                  <a-icon type="delete" />删除
                </a>
              </a-popconfirm>
            </a-space>

          </template>
        </span>
      </s-table>

      <!-- 操作抽屉 -->
      <a-drawer width="50%" :title="actionTitle" :visible="actionVisible" :after-visible-change="afterActionVisibleChange" @close="actionOnClose">
        <div class="actionBox">
          <div class="actionBox-title">基本信息</div>
          <a-row type="flex" justify="space-between">
            <div style="flex:2">
              <img style="margin:0 auto;width:100%;margin:35px 0;" src="../../assets/img/u2133.png" alt="">
            </div>
            <div style="flex:8">
              <a-descriptions :column="2" size="small" bordered>
                <a-descriptions-item label="ID">
                  <a-input v-model="actionForm.id" :disabled="viewVisible" placeholder=""></a-input>
                </a-descriptions-item>
                <a-descriptions-item label="姓名">
                  <a-input v-model="actionForm.name" :disabled="viewVisible" placeholder=""></a-input>
                </a-descriptions-item>
                <a-descriptions-item label="手机号">
                  <a-input v-model="actionForm.mobile" :disabled="viewVisible" placeholder=""></a-input>
                </a-descriptions-item>
                <a-descriptions-item label="平台科室">
                  <a-select v-model="actionForm.ptDepartmanet" :disabled="viewVisible" style="width:100%;" placeholder="请选择科室">
                    <a-select-option value="内科">
                      内科
                    </a-select-option>
                    <a-select-option value="外科">
                      外科
                    </a-select-option>
                    <a-select-option value="骨科">
                      骨科
                    </a-select-option>
                  </a-select>
                </a-descriptions-item>
                <a-descriptions-item label="性别">
                  <a-select v-model="actionForm.sex" :disabled="viewVisible" style="width:100%;" placeholder="请选择性别">
                    <a-select-option value="男">
                      男
                    </a-select-option>
                    <a-select-option value="女">
                      女
                    </a-select-option>
                  </a-select>
                </a-descriptions-item>
                <a-descriptions-item label="医院">
                  <a-select v-model="actionForm.hospital" :disabled="viewVisible" style="width:100%;" placeholder="请选择医院">
                    <a-select-option value="成都四六一医院">
                      成都四六一医院
                    </a-select-option>
                    <a-select-option value="湘雅医学院">
                      湘雅医学院
                    </a-select-option>
                  </a-select>
                </a-descriptions-item>
                <a-descriptions-item label="职称">
                  <a-select v-model="actionForm.job" :disabled="viewVisible" style="width:100%;" placeholder="请选择职称">
                    <a-select-option value="医师">
                      医师
                    </a-select-option>
                    <a-select-option value="副主任医师">
                      副主任医师
                    </a-select-option>
                    <a-select-option value="主任医师">
                      主任医师
                    </a-select-option>
                  </a-select>
                </a-descriptions-item>
                <a-descriptions-item label="医院科室">
                  <a-select v-model="actionForm.department" :disabled="viewVisible" style="width:100%;" placeholder="请选择科室">
                    <a-select-option value="内科">
                      内科
                    </a-select-option>
                    <a-select-option value="外科">
                      外科
                    </a-select-option>
                    <a-select-option value="骨科">
                      骨科
                    </a-select-option>
                  </a-select>
                </a-descriptions-item>
                <a-descriptions-item label="注册时间">
                  <a-input v-model="actionForm.time" :disabled="viewVisible" placeholder=""></a-input>
                </a-descriptions-item>
              </a-descriptions>
            </div>
          </a-row>

        </div>
        <div class="actionBox">
          <div class="actionBox-title">擅长</div>
          <a-textarea v-model="actionForm.goodAt" :disabled="viewVisible" :auto-size="{ minRows: 4, maxRows: 6 }"></a-textarea>
        </div>
        <div class="actionBox">
          <div class="actionBox-title">简介</div>
          <a-textarea v-model="actionForm.introduction" :disabled="viewVisible" :auto-size="{ minRows: 6, maxRows: 10 }"></a-textarea>
        </div>
        <div class="actionBox">
          <a-modal :visible="previewVisible" :footer="null" @cancel="previewHandleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
          <div class="actionBox-title" style="">照片证书</div>
          <a-row type="flex" style="margin:15px;">
            <div style="width:100px;">医生照片</div>
            <div style="flex:9">
              <a-upload :disabled="viewVisible" action="https://www.mocky.io/v2/5cc8019d300000980a055e76" list-type="picture-card" :file-list="doctorFileList" @preview="uploadHandlePreview" @change="({ fileList })=>uploadHandleChange({ fileList },'doctorFileList')">
                <div v-if="doctorFileList.length < 1">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">
                    Upload
                  </div>
                </div>
              </a-upload>
            </div>
          </a-row>

          <a-row type="flex" style="margin:15px;">
            <div style="width:100px;">执业证书</div>
            <div style="flex:9">
              <a-upload :disabled="viewVisible" action="https://www.mocky.io/v2/5cc8019d300000980a055e76" list-type="picture-card" :file-list="practiceFileList" @preview="uploadHandlePreview" @change="({ fileList })=>uploadHandleChange({ fileList },'practiceFileList')">
                <div v-if="practiceFileList.length < 9">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">
                    Upload
                  </div>
                </div>
              </a-upload>
            </div>
          </a-row>

          <a-row type="flex" style="margin:15px;">
            <div style="width:100px;">职称证书</div>
            <div style="flex:9">
              <a-upload :disabled="viewVisible" action="https://www.mocky.io/v2/5cc8019d300000980a055e76" list-type="picture-card" :file-list="jobFileList" @preview="uploadHandlePreview" @change="({ fileList })=>uploadHandleChange({ fileList },'jobFileList')">
                <div v-if="jobFileList.length < 9">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">
                    Upload
                  </div>
                </div>
              </a-upload>
            </div>
          </a-row>

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
      </a-drawer>

      <!-- 操作对话框 -->
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
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable } from '@/components'
import { getRoleList, getDoctorList } from '@/api/manage'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

const columns = [
  // {
  //   title: '#',
  //   scopedSlots: { customRender: 'serial' },
  // },
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '电话',
    dataIndex: 'mobile',
  },
  {
    title: '医院',
    dataIndex: 'hospital',
  },
  {
    title: '科室',
    dataIndex: 'department',
  },
  {
    title: '职称',
    dataIndex: 'job',
  },
  {
    title: '加入时间',
    dataIndex: 'joinTime',
  },
  {
    title: '审核状态',
    dataIndex: 'status',
  },
  // {
  //   title: '服务审核',
  //   dataIndex: 'service',
  // },
  // {
  //   title: '粉丝',
  //   dataIndex: 'fans',
  // },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'center',
    width: '230px',
  },
]

export default {
  name: 'ServiceCheck',
  inject: ['reloadCard'],
  components: {
    STable,
  },
  data() {
    this.columns = columns
    return {
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: true,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return getDoctorList(requestParameters).then((res) => {
          return res.result
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      // 操作
      actionTitle: '新增医生',
      actionVisible: false,
      actionForm: {
        id: '',
        name: '',
        mobile: '',
        ptDepartmanet: '',
        sex: '',
        hospital: '',
        job: '',
        department: '',
        time: '',
        goodAt: '',
        introduction: '',
      },
      // 上传图片
      previewVisible: false,
      previewImage: '',
      doctorFileList: [],
      practiceFileList: [],
      jobFileList: [],
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
  created() {
    getRoleList({ t: new Date() })
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
      }
    },
  },
  methods: {
    handleEdit(record) {
      this.checkInfo = record
      this.checkVisible = true
    },
    checkHandleOk() {
      this.checkVisible = false
    },
    handleSub(record) {
      if (record.status !== 0) {
        this.$message.info(`${record.no} 删除成功`)
      } else {
        this.$message.error(`${record.no} 删除失败，规则已关闭`)
      }
    },
    // 切换标签
    changeTabs(key) {
      console.log(key)
      this.$refs.table.refresh(true)
    },
    // 选择表格
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    // 新增医生
    add() {
      this.actionTitle = '新增医生'
      this.actionVisible = true
      this.viewVisible = false
    },
    // 操作抽屉
    afterActionVisibleChange(val) {
      console.log('visible', val)
      if (!val) {
        this.actionForm = this.$options.data().actionForm
      }
    },
    actionOnClose() {
      this.actionVisible = false
    },
    actionOnSave() {
      // this.$refs.actionRuleForm.validate((valid) => {
      //   if (valid) {
      //     alert('submit!')
      //   } else {
      //     console.log('error submit!!')
      //     return false
      //   }
      // })
    },
    // 上传图片
    previewHandleCancel() {
      this.previewVisible = false
    },
    async uploadHandlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    uploadHandleChange({ fileList }, listName) {
      console.log(fileList, listName)
      this[listName] = fileList
    },
    // 查看医生详情
    toView(record) {
      console.log(record)
      Object.assign(this.actionForm, record)
      this.actionTitle = '医生详情'
      this.actionVisible = true
      this.viewVisible = true
    },
  },
}
</script>
