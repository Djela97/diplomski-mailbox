<template>
    <table v-if="messages.length > 0" class="table table-inbox table-hover">
        <tbody>
            <tr v-for="message in messages" @click="openMessage(message)" :class="{ unread: typeof message.isRead !== 'undefined' && !message.isRead }">
                <td></td>
                <td>
                    <a href="#" v-if="typeof message.isImportant !== 'undefined'" @click.prevent.stop="message.isImportant = !message.isImportant">
                        <i :class="['fa', 'fa-star', { important: message.isImportant }]"></i>
                    </a>
                </td>
                <td>{{ message.senderName }}</td>
                <td>{{ message.subject }}</td>
<!--                <td class="text-right">{{ message.date.fromNow() }}</td>-->
            </tr>
        </tbody>
    </table>

    <p v-else>No messages here yet. {{messages.length}}</p>
</template>

<script>
    import { eventBus } from './main';
    import Vue from 'vue';
    import axios from 'axios';
    import VueAxios from 'vue-axios';
    Vue.use(axios, VueAxios);

    export default {
        props: {
            messages: {
                type: Array,
                required: true
            },
            data:{
                type: Object
            }
        },
        methods: {
            openMessage(message) {
                eventBus.$emit('changeView', {
                    tag: 'app-view-message',
                    title: message.subject,
                    data: {
                        message: message,
                        folders: this.data.folders
                    }
                });

                const headers = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                };

                axios.post('http://localhost:8080/message/read', message, {headers})
                    .then(function (response) {})
                    .catch((error)=> {
                        console.log(error);
                    })
            }
        }
    }
</script>