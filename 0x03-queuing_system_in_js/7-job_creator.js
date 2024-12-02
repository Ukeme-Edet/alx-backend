import kue from "kue";
const jobs = [
    {
        phoneNumber: "4153518780",
        message: "This is the code 1234 to verify your account",
    },
    {
        phoneNumber: "4153518781",
        message: "This is the code 4562 to verify your account",
    },
    {
        phoneNumber: "4153518743",
        message: "This is the code 4321 to verify your account",
    },
    {
        phoneNumber: "4153538781",
        message: "This is the code 4562 to verify your account",
    },
    {
        phoneNumber: "4153118782",
        message: "This is the code 4321 to verify your account",
    },
    {
        phoneNumber: "4153718781",
        message: "This is the code 4562 to verify your account",
    },
    {
        phoneNumber: "4159518782",
        message: "This is the code 4321 to verify your account",
    },
    {
        phoneNumber: "4158718781",
        message: "This is the code 4562 to verify your account",
    },
    {
        phoneNumber: "4153818782",
        message: "This is the code 4321 to verify your account",
    },
    {
        phoneNumber: "4154318781",
        message: "This is the code 4562 to verify your account",
    },
    {
        phoneNumber: "4151218782",
        message: "This is the code 4321 to verify your account",
    },
];
const queue = kue.createQueue();
for (let job of jobs) {
    const createdJob = queue
        .create("push_notification_code", job)
        .save((err) => {
            if (!err) console.log(`Notification job created: ${createdJob.id}`);
        });
    createdJob.on("complete", () =>
        console.log(`Notification job ${createdJob.id} completed`)
    );
    createdJob.on("failed", (errorMessage) =>
        console.log(`Notification job ${createdJob.id} failed: ${errorMessage}`)
    );
    createdJob.on("progress", (progress) =>
        console.log(`Notification job ${createdJob.id} ${progress}% complete`)
    );
}
export { queue };
