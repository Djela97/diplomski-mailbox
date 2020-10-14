<template>
    <div class="inbox-body">
        <div class="mail-option">
            <button class="btn btn-primary" @click="navigateBack">
                <i class="fa fa-arrow-left" aria-hidden="true"></i>&nbsp; Back
            </button>

            <button class="btn btn-danger" @click="modifyMessage(data.message, 'delete')">
                <i class="fa fa-trash-o"></i>&nbsp; {{ data.message.isDeleted ? 'Restore' : 'Delete' }}
            </button>

            <template v-if="typeof data.message.isRead !== 'undefined'">
                <button class="btn btn-primary" @click="modifyMessage(data.message, 'unread')"
                        :disabled="!data.message.isRead">
                    <i class="fa fa-envelope-open" aria-hidden="true"></i>&nbsp; Mark as unread
                </button>

                <button class="btn btn-primary" @click="modifyMessage(data.message, 'read')"
                        :disabled="data.message.isRead">
                    <i class="fa fa-envelope" aria-hidden="true"></i>&nbsp; Mark as read
                </button>
            </template>

            <template v-if="typeof data.message.isImportant !== 'undefined'">
                <button class="btn btn-warning" @click="modifyMessage(data.message, 'unimportant')"
                        :disabled="!data.message.isImportant">
                    <i class="fa fa-star" aria-hidden="true"></i>&nbsp; Mark as unimportant
                </button>

                <button class="btn btn-warning" @click="modifyMessage(data.message, 'important')"
                        :disabled="data.message.isImportant">
                    <i class="fa fa-star-o" aria-hidden="true"></i>&nbsp; Mark as important
                </button>
            </template>

            <div class="btn-group dropright">
                <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true"
                        aria-expanded="false">
                    <i class="fa fa-folder-open" aria-hidden="true"></i>
                    Move to folder
                </button>
                <div class="dropdown-menu">
                    <a v-for="folder in data.folders" class="dropdown-item" @click="sendToFolder(folder.name)">
                        {{folder.name}}
                    </a>
                </div>
            </div>


        </div>

        <p><strong>From:</strong> {{ data.message.senderName }} <{{ data.message.senderMail }}></p>
        <hr>

        <div v-html="data.message.content" class="message"></div>

        <div class="mail-option">
            <div class="compose-wrapper-1">
                <app-reply :message="replyMessage"></app-reply>
            </div>
            <div class="compose-wrapper-1">
                <app-forward :message="data.message"></app-forward>
            </div>
<!--            <div class="compose-wrapper-1">-->
<!--                <app-reply></app-reply>-->
<!--            </div>-->
<!--            <button class="btn btn-success" @click="modifyMessage(data.message, 'unimportant')">-->
<!--                <i class="fa fa-arrow-circle-left" aria-hidden="true"></i>&nbsp; Reply-->
<!--            </button>-->
<!--            <button class="btn btn-info" @click="modifyMessage(data.message, 'unimportant')">-->
<!--                <i class="fa fa-arrow-right" aria-hidden="true"></i>&nbsp; Forward-->
<!--            </button>-->
        </div>
    </div>
</template>

<script>
    import { eventBus } from './main';
    import Vue from 'vue';
    import axios from 'axios';
    import VueAxios from 'vue-axios';
    import Reply from "./Reply.vue";
    import Forward from "./Forward.vue";
    Vue.use(axios, VueAxios);

    export default {
        props: {
            data: {
                type: Object,
                required: true
            },
        },
        data() {
            return {
                replyMessage: {}
            };
        },
        activated() {
            if (typeof this.data.message.isRead !== 'undefined') {
                this.data.message.isRead = true;
            }
            this.replyMessage = JSON.parse(JSON.stringify(this.data.message));
            this.replyMessage.subject = 'Re: ' + this.replyMessage.subject;
            this.replyMessage.content = '\n' +
                '\n' +
                'Original message:\n' +
                this.replyMessage.content;
        },
        methods: {
            navigateBack() {
                let previousView = this.$parent.previousView;

                eventBus.$emit('changeView', {
                    tag: previousView.tag,
                    title: previousView.title,
                    data: previousView.data
                });
                eventBus.$emit('refreshMessages');
            },
            modifyMessage(message, mode){
                if(mode === 'delete'){
                    message.isDeleted = !message.isDeleted;
                } else if (mode === 'read'){
                    message.isRead = true;
                } else if (mode === 'unread'){
                    message.isRead = false;
                } else if (mode === 'important'){
                    message.isImportant = true;
                } else if (mode === 'unimportant'){
                    message.isImportant = false;
                }

                const headers = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                };

                axios.post('https://diplomski-quarkus.herokuapp.com/message/'+mode, message, {headers})
                    .then(function (response) {})
                    .catch((error)=> {
                        console.log(error);
                    });
            },
            sendToFolder(fname){
                const headers = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                };
                let user = JSON.parse(window.name);
                axios.post('https://diplomski-quarkus.herokuapp.com/message/move?username='+user.username+'&foldername='+fname,
                    this.data.message,
                    {headers})
                    .then(function (response) {
                        window.history.go();
                    })
                    .catch((error)=> {
                        console.log(error);
                    });
            }
        },
        filters: {
            formatBytes(bytes) {
                if (bytes == 0) {
                    return '0 Bytes';
                }

                let decimals = 2;
                let k = 1000;
                let dm = decimals + 1 || 3;
                let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
                let i = Math.floor(Math.log(bytes) / Math.log(k));

                return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
            }
        },
        components: {
            appReply: Reply,
            appForward: Forward
        },
    }
</script>