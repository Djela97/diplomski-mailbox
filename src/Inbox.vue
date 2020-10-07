<template>
    <div class="inbox-body">
        <div class="mail-option">
            <div class="btn-group">
                <a href="#" class="btn" @click="refresh">
                    <i class="fa fa-refresh"></i>&nbsp; Refresh
                </a>
            </div>
        </div>

        <app-messages :messages="incomingMessages" :data="data"></app-messages>
    </div>
</template>

<script>
    import { eventBus } from './main';
    import Messages from './Messages.vue';
    import Vue from 'vue';
    import axios from 'axios';
    import VueAxios from 'vue-axios';
    Vue.use(axios, VueAxios);

    let mess = [];
    // function myFunction(result){
    //     let mes = new Message(
    //         result.subject,
    //         result.content,
    //         result.isImportant,
    //         result.isDeleted,
    //         result.isRead,
    //         result.sender.mail,
    //         result.sender.username
    //     );
    //     console.log("inbox: mes je " + JSON.stringify(mes));
    //     mess.push(mes);
    // }
    export default {
        props: {
            data: {
                type: Object,
                required: true
            }
        },
        methods: {
            refresh() {
                mess=[];
                eventBus.$emit('refreshMessages');
            }
        },
        computed: {
            incomingMessages() {
                let user = JSON.parse(window.name);
                return this.data.messages.filter(function (message) {
                    return (!message.isDeleted && user.mail !== message.senderMail);
                });
            }
        },
        components: {
            appMessages: Messages
        }
    }
</script>