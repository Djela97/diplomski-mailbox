<template>
    <div class="inbox-body">
        <app-messages :messages="sentMessages" :data="data"></app-messages>
    </div>
</template>

<script>
    import Messages from './Messages.vue';

    export default {
        props: {
            data: {
                type: Object,
                required: true
            }
        },
            computed: {
            sentMessages() {
                let payload = JSON.parse(window.name);
                return this.data.messages.filter(function(message) {
                    return (!message.isDeleted && message.senderName === payload.username);
                });
            }
        },
        components: {
            appMessages: Messages
        }
    }
</script>