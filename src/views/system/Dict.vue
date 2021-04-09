<template>
  <div class="dict">
    <div class="dictList">
      <div class="cardHeader">
        <span class="title">字典列表</span>
      </div>
      <div class="cardBody">
        <!-- 搜索栏 -->
        <transition name="mask">
          <div class="search" v-show="searchList">
            <a-form-model ref="queryListRuleForm" :model="queryInfoList" :rules="queryRulesList" :label-col="{span: 6}" :wrapper-col="{span: 18}" @keyup.enter.native="onSubmit('queryListRuleForm')">
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-model-item label="字典编号" prop="dictType">
                    <a-input placeholder="字典编号" v-model="queryInfoList.dictType" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="字典名称" prop="dictName">
                    <a-input placeholder="字典名称" v-model="queryInfoList.dictName" />
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row type="flex" justify="end">
                <a-col :span="12">
                  <a-form-model-item :wrapper-col="{ span: 24 }" style="float:right;">
                    <a-button style="margin-right:10px;" type="primary" icon="search" @click="onSubmit('queryListRuleForm')">
                      搜索
                    </a-button>
                    <a-button icon="delete" @click="resetForm('queryListRuleForm')">
                      清空
                    </a-button>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-form-model>
          </div>
        </transition>
        <!-- 操作按钮 -->
        <div class="operationButton" style="margin-bottom:16px;">
          <!-- 新增对话框 -->
          <a-modal destroyOnClose :maskClosable="false" width="800px" v-model="actionListVisible" :title="actionTitle" @ok="actionListHandleOk" @cancel="actionListHandleCancel" :afterClose="actionAfterClose">
            <template slot="footer">
              <a-button key="submit" type="primary" :loading="actionListLoading" icon="plus-circle" @click="actionListHandleOk">
                保存
              </a-button>
              <a-button key="back" icon="close-circle" @click="actionListHandleCancel">
                取消
              </a-button>
            </template>
            <a-form-model ref="addRuleForm" :model="actionDictListForm" :rules="addDictListRules" :label-col="{span:6}" :wrapper-col="{span:18}">
              <a-row :gutter="12">
                <a-col :span="24">
                  <a-form-model-item :labelCol="{span: 3}" :wrapperCol="{span: 21}" has-feedback label="字典编号" prop="dictType">
                    <a-input :disabled="isEdit" v-model="actionDictListForm.dictType" placeholder="请输入字典编号" />
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="12">
                <a-col :span="12">
                  <a-form-model-item has-feedback label="字典名称" prop="dictName">
                    <a-input :disabled="isEdit" v-model="actionDictListForm.dictName" placeholder="请输入字典名称" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="字典值状态" prop="dictStatus">
                    <a-switch :checked="actionDictListForm.dictStatus===1?true:false" checked-children="启用" un-checked-children="禁用" @change="changeDictStatus"></a-switch>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="12">
                <a-col :span="24">
                  <a-form-model-item :labelCol="{span: 3}" :wrapperCol="{span: 21}" has-feedback label="字典备注" prop="dictRemark">
                    <a-input v-model="actionDictListForm.dictRemark" placeholder="请输入字典备注" />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-form-model>
          </a-modal>
          <a-row type="flex" justify="space-between">
            <a-col>
              <a-space>
                <a-button type="primary" icon="plus" @click="addDictList">新增</a-button>
                <!-- <a-button type="danger" icon="delete">删除</a-button> -->
              </a-space>
            </a-col>
            <a-drawer width="50%" title="列显隐" placement="right" :visible="drawerVisible" @close="drawerOnClose">
              <div style="margin:0 auto;">
                <a-transfer :listStyle="{width:'45%',height:'500px'}" :titles="['隐藏','显示']" :data-source="mockData" show-search :filter-option="transferFilterOption" :target-keys="targetKeys" :render="item => item.title" @change="transferHandleChange" @search="transferHandleSearch" />
              </div>
            </a-drawer>
            <a-col>
              <a-space>
                <a-tooltip title="刷新">
                  <a-button shape="circle" icon="reload" @click="refresh" />
                </a-tooltip>
                <a-tooltip title="显隐">
                  <a-button shape="circle" icon="menu-fold" @click="showDrawer" />
                </a-tooltip>
                <a-tooltip title="搜索">
                  <a-button shape="circle" icon="search" @click="showSearch('searchList')" />
                </a-tooltip>
              </a-space>
            </a-col>
          </a-row>
        </div>
        <!-- 字典表格 -->
        <a-table :scroll="{ x: 600 }" :loading="listLoading" bordered :data-source="dataSourceList" :columns="columnsList" :row-selection="{selectedRowKeys: selectedRowKeysList, onChange: onSelectChangeList}" :rowKey="(record, index) => {return record.dictType}" :pagination="{ showSizeChanger: true, showQuickJumper: true, pageSize: queryInfoList.limit, total: total, current: queryInfoList.page, showTotal: ((total) => {return `共 ${total} 条`}) }" :customRow="customRow">
          <template slot="dictStatus" slot-scope="text">
            <!-- <a-switch :checked="text===1?true:false" checked-children="启用" un-checked-children="禁用" @change="(checked,event)=>changeStatus(checked,event,record)"></a-switch> -->
            <span v-if="text===1">启用</span>
            <span v-else>禁用</span>
          </template>
          <template slot="action" slot-scope="text,record">
            <a-space :size="15">
              <a @click="toEdit(record)" style="font-size:12px;">
                <a-icon type="edit" /> 编辑
              </a>
              <!-- <a-popconfirm title="确定删除吗?" @confirm="() => onDelete(record.dictType)">
                <a href="javascript:;" style="font-size:12px;">
                  <a-icon type="delete" /> 删除
                </a>
              </a-popconfirm> -->
            </a-space>
          </template>
        </a-table>
      </div>
    </div>
    <div class="dictDetails">
      <DictDetails v-if="isAliveDetails" :detailsTitle="detailsTitle" :dictType="dictType"></DictDetails>
    </div>
  </div>
</template>

<script>
import DictDetails from '@/components/DictDetails'
import { getDictList, addDictList, editDictList } from '@/api/system/dict'
const columnsList = [
  {
    title: '#',
    align: 'center',
    customRender: (text, record, index) => `${index + 1}`,
    width: '50px',
    fixed: 'left',
  },
  {
    title: '字典编号',
    dataIndex: 'dictType',
  },
  {
    title: '字典名称',
    dataIndex: 'dictName',
  },
  {
    title: '字典值状态',
    dataIndex: 'dictStatus',
    scopedSlots: { customRender: 'dictStatus' },
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' },
    align: 'center',
    width: '100px',
    fixed: 'right',
  },
]

export default {
  name: 'Dict',
  inject: ['reloadCard'],
  provide() {
    return {
      reloadDetails: this.reloadDetails,
    }
  },
  components: {
    DictDetails,
  },
  data() {
    return {
      // 字典列表搜索
      searchList: true,
      queryInfoList: {
        dictName: '',
        dictType: '',
        limit: 10,
        orderFiled: '',
        orderType: 'asc',
        page: 1,
      },
      queryRulesList: {},
      // 新增字典列表
      actionTitle: '新增',
      actionListVisible: false,
      actionListLoading: false,
      actionDictListForm: {
        dictType: '',
        dictName: '',
        dictStatus: 2,
        dictRemark: '',
      },
      addDictListRules: {
        dictType: [{ required: true, message: '请输入字典编号', trigger: 'blur' }],
        dictName: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
        dictStatus: [{ required: true, message: '请选择是否封存', trigger: 'change' }],
      },
      // 列显隐
      drawerVisible: false,
      mockData: [
        {
          key: '1',
          title: '字典排序',
          description: 'description of 字典排序',
        },
        {
          key: '2',
          title: '字典备注',
          description: 'description of 字典备注',
        },
        {
          key: '3',
          title: '字典编号',
          description: 'description of 字典编号',
        },
        {
          key: '4',
          title: '字典名称',
          description: 'description of 字典名称',
        },
        {
          key: '5',
          title: '封存',
          description: 'description of 封存',
        },
      ],
      targetKeys: ['1', '2', '3', '4'],
      // 字典表格
      columnsList,
      dataSourceList: [],
      listLoading: false,
      selectedRowKeysList: [],
      total: 0,
      // 编辑
      isEdit: false,

      isAliveDetails: true,
      detailsTitle: '暂无',
      dictType: '',
    }
  },
  mounted() {
    this.getTableList()
  },
  methods: {
    getTableList() {
      this.listLoading = true
      getDictList(this.queryInfoList)
        .then((res) => {
          console.log(res)
          this.dataSourceList = res.data
          if (res.success) {
            this.total = res.count
          } else {
            this.$message.warning(res.message)
          }
          this.listLoading = false
        })
        .catch((err) => {
          console.error(err)
        })
    },
    // 刷新路由组件
    reloadDetails() {
      this.isAliveDetails = false
      this.$nextTick(() => {
        this.isAliveDetails = true
      })
    },
    // 提交搜索
    onSubmit(formName) {
      console.log(formName)
      this.queryInfoList.page = 1
      this.getTableList()
    },
    // 重置搜索框
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 新增字典列表
    addDictList() {
      this.actionListVisible = true
      this.actionTitle = '新增'
    },
    // 保存
    actionListHandleOk() {
      if (this.actionTitle === '新增') {
        addDictList(this.actionDictListForm)
          .then((res) => {
            if (res.success) {
              this.$message.success('新增成功')
              this.actionListVisible = false
            } else {
              this.$message.error(res.message)
            }
          })
          .catch((err) => {
            console.error(err)
          })
      } else {
        editDictList(this.actionDictListForm)
          .then((res) => {
            if (res.success) {
              this.$message.success('编辑成功')
              this.actionListVisible = false
            } else {
              this.$message.error(res.message)
            }
          })
          .catch((err) => {
            console.error(err)
          })
      }
    },
    // 取消
    actionListHandleCancel() {
      this.actionListVisible = false
    },
    // 对话框关闭
    actionAfterClose() {
      this.isEdit = false
      this.actionDictListForm = this.$options.data().actionDictListForm
    },
    // 改变字典值状态
    changeDictStatus(checked) {
      this.actionDictListForm.dictStatus = checked ? 1 : 2
    },
    // 刷新此页面
    refresh() {
      this.reloadCard()
    },
    // 打开列显隐
    showDrawer() {
      this.drawerVisible = true
    },
    // 关闭列显隐抽屉
    drawerOnClose() {
      this.drawerVisible = false
    },
    // 穿梭框
    transferFilterOption(inputValue, option) {
      return option.description.indexOf(inputValue) > -1
    },
    transferHandleChange(targetKeys, direction, moveKeys) {
      console.log(targetKeys, direction, moveKeys)
      this.targetKeys = targetKeys
    },
    transferHandleSearch(dir, value) {
      console.log('search:', dir, value)
    },
    // 搜索栏显示与隐藏
    showSearch(searchName) {
      this[searchName] = !this[searchName]
    },
    // 勾选表格数据
    onSelectChangeList(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeysList = selectedRowKeys
    },
    // 点击表格行
    customRow(record, index) {
      return {
        on: {
          // 鼠标单击行
          click: (event) => {
            // do something
            console.log(event)
            console.log(record, index)
            this.detailsTitle = record.dictName
            this.dictType = record.dictType
            // this.$store.commit('dict/changeTitle', record.name)
          },
        },
      }
    },
    // 改变状态开关
    changeStatus(checked, event, record) {
      // activeUser(record.userId)
      //   .then((res) => {
      //     if (res.success) {
      record.dictStatus = checked ? 1 : 2
      //       this.$message.success(checked ? '启用成功' : '禁用成功')
      //     } else {
      //       this.$message.warning(res.message)
      //     }
      //   })
      //   .catch((err) => {
      //     console.error(err)
      //   })
    },
    // 编辑
    toEdit(record) {
      console.log(record)
      this.actionListVisible = true
      this.isEdit = true
      this.actionTitle = '编辑'
      this.actionDictListForm = record
    },
    // 删除
    onDelete(key) {
      console.log(key)
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
    height: 130px;
  }
}
.mask-enter-active {
  animation: mask-in 0.2s linear;
}
.mask-leave-active {
  animation: mask-in 0.2s reverse linear;
}
.cardHeader {
  border-bottom: 1px solid #eee;
  padding: 6px 18px;
  .title {
    font-size: 18px;
  }
}
.cardBody {
  padding: 16px;
  .search {
    height: 130px;
    overflow: hidden;
  }
}
.dict {
  display: flex;
  justify-content: space-between;
  min-height: 280px;
  .dictList {
    width: 45%;
    min-height: 280px;
    background: #fff;
    padding: 16px;
  }
  .dictDetails {
    width: 54%;
    height: 100%;
    background: #fff;
    padding: 16px;
  }
}
</style>