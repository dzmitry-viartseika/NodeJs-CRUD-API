export const nextWorkerId = (currentWorkerID: number, numCPUs: number) => {
    if (currentWorkerID === numCPUs - 1) {
        return 0;
    } else {
        return (currentWorkerID + 1);
    }
};