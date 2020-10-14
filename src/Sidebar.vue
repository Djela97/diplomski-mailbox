<template>
    <aside class="sm-side">
        <div class="user-head">
            <img src="src/assets/images/logo.jpeg" width="65" height="65">

            <div class="user-name">
                <h5>{{payload.username}}</h5>
                <span class="email-address">{{payload.mail}}</span>
            </div>
        </div>

        <div class="compose-wrapper">
            <app-compose></app-compose>
        </div>

        <ul class="inbox-nav">
            <li :class="{ active: activeView == 'app-inbox' }">
                <a href="#" @click.prevent="navigate('app-inbox', 'Inbox')">
                    <i class="fa fa-inbox"></i>Inbox <span class="label label-danger pull-right">{{ unreadMessages.length }}</span>
                </a>
            </li>

            <li :class="{ active: activeView == 'app-sent' }">
                <a href="#" @click.prevent="navigate('app-sent', 'Sent')">
                    <i class="fa fa-envelope-o"></i>Sent <span class="label label-default pull-right">{{ sentMessages.length }}</span>
                </a>
            </li>

            <li :class="{ active: activeView == 'app-important' }">
                <a href="#" @click.prevent="navigate('app-important', 'Important')">
                    <i class="fa fa-bookmark-o"></i>Important <span class="label label-warning pull-right">{{ importantMessages.length }}</span>
                </a>
            </li>

            <li :class="{ active: activeView == 'app-trash' }">
                <a href="#" @click.prevent="navigate('app-trash', 'Trash')">
                    <i class=" fa fa-trash-o"></i>Trash <span class="label label-default pull-right">{{ trashedMessages.length }}</span>
                </a>
            </li>

            <li v-for="folder in folders" :class="{ active: activeView == folder.name }">
                <a href="#" @click.prevent="navigateF('app-folder', folder.name, folder.messages)">
                    <i class=" fa fa-folder-o"></i> {{folder.name}}
                    <span class="label label-default pull-right">{{folder.messages.length}}</span>
                </a>
            </li>

            <li>
                <a href="#">
                    <input type="text" v-model="input" id="input" class="form-control" placeholder="Folder name">
                    <button type="button" style="float: left" class="btn btn-danger" @click="deleteFolder()">Delete
                        folder</button>
                    <button type="button" style="float: right" class="btn btn-primary" @click="createFolder()">Create
                        folder</button>
                </a>
            </li>
        </ul>
    </aside>
</template>

<script>
    import { eventBus } from './main';
    import Compose from './Compose.vue';
    import Vue from 'vue';
    import axios from 'axios';
    import VueAxios from 'vue-axios';
    import Folder from "./data/folder";
    Vue.use(axios, VueAxios);

    let mess = [];
    export default {
        props: {
            messages: {
                type: Array,
                required: true
            },
            folders:{
                type: Array
            }
        },
        data() {
            return {
                activeView: 'app-inbox',
                input: ''
            };
        },
        payload: () => ({mail: 'a', username: 'b', folders:[]}),
        created() {
            eventBus.$emit('refreshMessages');
            this.payload = JSON.parse(window.name);
            console.log(this.payload);

            eventBus.$on('changeView', (data) => {
                this.activeView = data.tag;
            });
        },
        methods: {
            navigate(newView, title) {
                eventBus.$emit('changeView', {
                    tag: newView,
                    title: title
                });
            },
            navigateF(newView, title, messages){
                eventBus.$emit('changeView', {
                    tag: newView,
                    title: title,
                    messages: messages
                });
            },
            createFolder(){
                let user = JSON.parse(window.name);
                const headers = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                };

                axios.post('https://diplomski-quarkus.herokuapp.com/folders/create?username='+user.username,
                    {folderName: this.input}, {headers})
                    .then(function (response) {
                        window.history.go();
                    })
                    .catch((error)=> {
                        console.log(error);
                        this.$alert(error.response.data);
                    });

            },
            deleteFolder(){
                let user = JSON.parse(window.name);
                const headers = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                };

                axios.post('https://diplomski-quarkus.herokuapp.com/folders/delete?username='+user.username,
                    {folderName: this.input}, {headers})
                    .then(function (response) {
                        window.history.go();
                    })
                    .catch((error)=> {
                        console.log(error);
                        this.$alert(error.response.data);
                    });
            }
        },

        computed: {
            unreadMessages() {
                let user = JSON.parse(window.name);
                return this.messages.filter(function(message) {
                    console.log("111 " + user.mail + " " + message.senderMail);
                    return (!message.isRead && !message.isDeleted && user.mail !== message.senderMail);
                });
            },
            sentMessages() {
                let payload = JSON.parse(window.name);
                return this.messages.filter(function(message) {
                    return (!message.isDeleted && message.senderName === payload.username);
                });
            },
            importantMessages() {
                return this.messages.filter(function(message) {
                    return (message.isImportant === true && !message.isDeleted);
                });
            },
            trashedMessages() {
                return this.messages.filter(function(message) {
                    return message.isDeleted === true;
                });
            }
        },
        components: {
            appCompose: Compose
        },

    }
</script>