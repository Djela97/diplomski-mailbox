<template>
    <div>
        <a href="#composeModal" data-toggle="modal" class="btn btn-compose">Compose</a>

        <div aria-hidden="true" role="dialog" tabindex="-1" id="composeModal" class="modal fade" style="display: none;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button aria-hidden="true" data-dismiss="modal" class="close" type="button">&times;</button>
                        <h4 class="modal-title">New Message</h4>
                    </div>

                    <div class="modal-body">
                        <form @submit.prevent="sendMessage" role="form" class="form-horizontal">
                            <div class="form-group">
                                <label class="col-lg-2 control-label" for="receiverMail">Send to:</label>
                                <div class="col-lg-10">
                                    <input type="text" v-model="message.receiverMail" id="receiverMail"
                                           class="form-control">
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
        data() {
            return {
                message: {
                    subject: '',
                    content: '',
                    receiverMail: ''
                }
            };
        },
        methods: {
            sendMessage() {
                const headers = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                };

                let user = JSON.parse(window.name);
                let m = {
                    subject: this.message.subject,
                    content: this.message.content,
                    isDeleted: false,
                    senderMail: user.mail,
                    senderName: user.username,
                    receiverMail: this.message.receiverMail
                };
                axios.post('https://diplomski-quarkus.herokuapp.com/message/send', m, {headers})
                    .then(function (response) {
                        console.log(response);
                        eventBus.$emit('sentMessage', {
                            message: m
                        });
                        window.location.href = 'http://localhost:4001/inbox';
                    })
                    .catch((error)=> {
                        console.log(error);
                        this.$alert(error.response.data);
                    })
            }
        }
    }
</script>