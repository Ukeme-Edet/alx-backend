import kue from "kue";
const blackList = ["4153518780", "4153518781"];
const sendNotification = (phoneNumber, message, job, done) => {
    job.progress(0, 100);
    if (blackList.includes(phoneNumber)) {
        return done(Error(`Phone number ${phoneNumber} is blacklisted`));
    }
    job.progress(50, 100);
    console.log(
        `Sending notification to ${phoneNumber}, with message: ${message}`
    );
    done();
};
const queue = kue.createQueue();
queue.process("push_notification_code", (job, done) => {
    sendNotification(job.data.phoneNumber, job.data.message, job, done);
});
export { sendNotification, queue };
