<template>
    <div>
        <a href="#composeModal2" data-toggle="modal" class="btn btn-reply">Forward</a>

        <div aria-hidden="true" role="dialog" tabindex="-1" id="composeModal2" class="modal fade" style="display:
        none;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button aria-hidden="true" data-dismiss="modal" class="close" type="button">&times;</button>
                        <h4 class="modal-title">Forward message</h4>
                    </div>

                    <div class="modal-body">
                        <form @submit.prevent="sendMessages" role="form" class="form-horizontal">
                            <div class="form-group">
                                <label class="col-lg-2 control-label" for="forwardingMails">Send to:</label>
                                <div class="col-lg-10">
                                    <input type="text" v-model="forwardingMails" id="forwardingMails"
                                           class="form-control" placeholder="Input mails separated by semi-colon(;)">
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="col-lg-2 control-label" for="subject">Subject</label>
                                <div class="col-lg-10">
                                    <input type="text" v-model="message.subject" id="subject" class="form-control">
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="col-lg-2 control-label" for="message">Message</label>
                                <div class="col-lg-10">
                                    <textarea v-model="message.content" rows="10" cols="30" class="form-control"
                                              id="message" maxlength="254"></textarea>
                                </div>
                            </div>

                            <div class="form-group">
                                <div class="col-lg-offset-2 col-lg-10">
                                    <button class="btn btn-send" type="submit">Send</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { eventBus } from './main';
    import Vue from 'vue';
    import axios from 'axios';
    import VueAxios from 'vue-axios';
    Vue.use(axios, VueAxios);


    export default {
        props: {
            message: {
                type: Object,
                required: true
            },
        },
        data() {
            return {
                forwardingMails: []
            };
        },
        methods: {
            sendMessages(){
                function sendMessage(item, message) {
                    const headers = {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    };
                    let user = JSON.parse(window.name);

                    let m = {
                        subject: message.subject,
                        content: 'Forwarded from: ' + message.senderMail + '\n' + message.content,
                        isDeleted: false,
                        isImportant: false,
                        senderMail: user.mail,
                        senderName: user.username,
                        receiverMail: item
                    };
                    axios.post('https://diplomski-quarkus.herokuapp.com/message/send', m, {headers})
                        .then(function (response) {
                            console.log(response);
                            eventBus.$emit('sentMessage', {
                                message: m
                            });
                            window.location.href = 'https://diplomski-mailbox.herokuapp.com/inbox';
                        })
                        .catch((error)=> {
                            console.log(error);
                            this.$alert(error.response.data);
                        })
                }
                let mails = this.forwardingMails.split(';');
                for (let index = 0; index < mails.length; ++index) {
                    sendMessage(mails[index], this.message);
                }
            },
        }
    }
</script>