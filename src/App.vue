<template>
    <div class="container">
        <div class="mail-box">
            <app-sidebar :messages="messages" :folders="folders"></app-sidebar>
            <app-content :messages="messages" :folders="folders"></app-content>
        </div>
    </div>
</template>

<script>
    import Sidebar from './Sidebar.vue';
    import Content from './Content.vue';
    import Message from './data/messages';
    import Vue from 'vue';
    import axios from 'axios';
    import VueAxios from 'vue-axios';
    Vue.use(axios, VueAxios);

    let mess = [];
    let folds = [];
    import { eventBus } from './main';
    import Folder from "./data/folder";
    export default {
        data() {
            return {
                messages: mess,
                folders: folds
            };
        },
        payload: () => ({mail: 'a', username: 'b'}),
        created() {
            eventBus.$on('refreshMessages', () => {
                const headers = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                };
                function mapMessages(result){
                    let mes = new Message(
                        result.subject,
                        result.content,
                        result.isImportant,
                        result.isDeleted,
                        result.isRead,
                        result.sender.mail,
                        result.sender.username,
                        result.receiver.mail,
                        result.receiver.username
                    );
                    console.log("mes je " + JSON.stringify(mes));
                    mess.push(mes);
                }
                function mapFolders(fold){
                    let f = new Folder(
                        fold.folderName,
                        fold.messageList
                    );
                    if(f.name !== 'inbox' && f.name !=='trash' && f.name !== 'important' && f.name !== 'sent')
                        folds.push(f);
                }
                mess = [];
                this.payload = JSON.parse(window.name);
                axios.get("https://diplomski-quarkus.herokuapp.com/message/list?username="+this.payload.username,{headers})
                    .then( (result) => {
                        let mes = result.data;
                        console.log(mes);
                        mes.forEach(mapMessages);
                        this.messages = mess;
                    })
                    .catch( (error) =>{
                        console.log(error);
                    });

                folds = [];
                axios.get("https://diplomski-quarkus.herokuapp.com/folders/list?username="+this.payload.username,{headers})
                    .then( (result) => {
                        let fs = result.data;
                        // console.log('fs: ' + JSON.stringify(fs));
                        fs.forEach(mapFolders);
                        console.log('folders: ' + JSON.stringify(folds));
                        this.folders = folds;
                        console.log('fo: ' + JSON.stringify(this.folders));
                    })
                    .catch( (error) =>{
                        console.log(error);
                    });


            });

            eventBus.$on('sentMessage', (data) => {
                let temp = [data.message];
                this.messages = temp.concat(this.messages.slice(0));
            });
        },
        components: {
            appSidebar: Sidebar,
            appContent: Content
        }
    }
</script>