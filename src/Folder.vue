<template>
    <div class="inbox-body">
        <app-messages :messages="foldersMessages" :data="data"></app-messages>
    </div>
</template>

<script>
    import Messages from './Messages.vue';

    export default {
        props: {
            data: {
                type: Object,
                required: true
            },
            fname: {
                type: String
            }
        },
        computed: {
            foldersMessages() {
                console.log("folders: " + JSON.stringify(this.data.folders));
                for (let f of this.data.folders) {
                    // console.log(f.name);
                    if (f.name === this.fname) {
                        console.log(f.messages);
                        for(let m of f.messages){
                            m.senderMail = m.sender.mail;
                            m.senderName = m.sender.username;
                            m.receiverName = m.receiver.username;
                            m.receiverMail = m.receiver.mail;
                        }
                        return f.messages;
                    }
                }
                return [];
                // return this.data.messages.filter(function(message) {
                //     return message.isDeleted === true;
                // });
            }
        },
        components: {
            appMessages: Messages
        }
    }
</script>