export default class Message{
    constructor(subject, content, isImportant, isDeleted, isRead, senderMail, senderName, receiverMail, receiverName) {
        this.subject = subject;
        this.content = content;
        this.isImportant = isImportant;
        this.isDeleted = isDeleted;
        this.isRead = isRead;
        this.senderMail = senderMail;
        this.senderName = senderName;
        this.receiverMail = receiverMail;
        this.receiverName = receiverName;
    }
}