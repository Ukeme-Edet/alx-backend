import kue from "kue";
const push_notification_code = kue.createQueue();
const job = push_notification_code.create("push_notification_code", {
    phoneNumber: "4153518780",
    message: "This is the code to verify your account",
});
job.save((error) => {
    if (!error) console.log(`Notification job created: ${job.id}`);
});
job.on("complete", () => {
    console.log("Notification job completed");
});
job.on("failed", () => {
    console.log("Notification job failed");
});
export { push_notification_code };
