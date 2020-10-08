<template>
    <aside class="lg-side">
        <div class="inbox-head">
            <h3>{{ currentView.title }}</h3>
                <a href="https://diplomski-login.herokuapp.com">
                    <button type="button" style="float: right" class="btn btn-primary">Sign out</button></a>
        </div>

        <keep-alive>
            <component :is="currentView.tag" :data="currentView.data" :fname="currentView.title"></component>
        </keep-alive>
    </aside>
</template>

<script>
    import { eventBus } from './main';
    import Inbox from './Inbox.vue';
    import Sent from './Sent.vue';
    import Important from './Important.vue';
    import Trash from './Trash.vue';
    import ViewMessage from './ViewMessage.vue';
    import Vue from 'vue';
    import axios from 'axios';
    import VueAxios from 'vue-axios';
    import Folder from "./Folder.vue";
    Vue.use(axios, VueAxios);

    let mess = [];

    export default {
        props: {
            messages: {
                type: Array,
                required: true
            },
            folders: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                history: [
                    {
                        tag: 'app-inbox',
                        title: 'Inbox',
                        data: {
                            messages: null
                        }
                    }
                ]
            };
        },
        created() {
            eventBus.$on('changeView', (data) => {
                let temp = [{
                    tag: data.tag,
                    title: data.title,
                    data: data.data || {}
                }];
                this.history = temp.concat(this.history.splice(0));
            });
        },
        computed: {
            currentView() {
                let current = this.history[0];
                current.data.messages = this.messages;
                current.data.folders = this.folders;
                return current;
            },
            previousView() {
                return typeof this.history[1] !== 'undefined' ? this.history[1] : null;
            }
        },
        components: {
            appInbox: Inbox,
            appSent: Sent,
            appImportant: Important,
            appTrash: Trash,
            appViewMessage: ViewMessage,
            appFolder: Folder
        }
    }
</script>