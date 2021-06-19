<template>
    <div class="panel">
        <el-tooltip class="item" effect="dark" :content="msg.inOut?'公众号发出的消息':'来自用户的消息'" placement="right">
            <a-tag size="mini" v-if="msg.inOut" class="margin-right el-icon-upload2"  type="info"></a-tag>
            <a-tag size="mini" v-else class="margin-right el-icon-download"></a-tag>
        </el-tooltip>
        <span class="panel-content">
            <span v-if="msg.msgType=='text'" v-html="msg.detail.content"></span>
            <span v-else-if="msg.msgType=='event'" >
                <a-tag size="mini" type="warning" effect="plain">事件</a-tag>
                <a-tag size="mini" type="info" effect="plain">{{msg.detail.event}}</a-tag>
                {{msg.detail.eventKey}}
            </span>
            <span v-else-if="msg.msgType=='transfer_customer_service'">
                <a-tag size="mini" type="warning" effect="plain">事件</a-tag>
                <a-tag size="mini" type="info" effect="plain">消息转客服</a-tag>
            </span>
            <span v-else>
                <a-tag size="mini" effect="plain">{{XmlMsgType[msg.msgType]}}</a-tag>
                后台不支持预览
            </span>
        </span>
    </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
    name:'wx-msg-preview',
    props:{
        msg:Object
    },
    computed:mapState({
        XmlMsgType:state=>state.message.XmlMsgType,
    })
}
</script>
<style scoped>
.panel,.panel a{
    color: #999;
    word-break: break-all;
}
</style>