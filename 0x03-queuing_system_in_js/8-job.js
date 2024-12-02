const createPushNotificationsJobs = (jobs, queue) => {
    if (!Array.isArray(jobs)) throw Error("Jobs is not an array");
    jobs.forEach((job) => {
        const createdJob = queue
            .create("push_notification_code", job)
            .save((err) => {
                if (!err)
                    console.log(`Notification job created: ${createdJob.id}`);
            });
        createdJob.on("complete", () =>
            console.log(`Notification job ${createdJob.id} completed`)
        );
        createdJob.on("failed", (errorMessage) =>
            console.log(
                `Notification job ${createdJob.id} failed: ${errorMessage}`
            )
        );
        createdJob.on("progress", (progress) =>
            console.log(
                `Notification job ${createdJob.id} ${progress}% complete`
            )
        );
    });
};
export default { createPushNotificationsJobs };
