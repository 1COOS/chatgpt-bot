import JSONdb from 'simple-json-db';
export const jsonDB = new JSONdb('./.storage');
const sleep = (time) => {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
};
const awaitErrorWrap = async (promise) => {
    try {
        const data = await promise;
        return [null, data];
    }
    catch (err) {
        return [err, null];
    }
};
export const log = (...args) => {
    console.log(new Date().toLocaleString(), ...args);
};
export const retryRequest = async (promise, retryTimes = 3, retryInterval = 10000) => {
    let output = [null, null];
    for (let a = 0; a < retryTimes; a++) {
        output = await awaitErrorWrap(promise());
        if (output[1]) {
            break;
        }
        console.log(`retry ${a + 1} times, error: ${output[0]}`);
        await sleep(retryInterval);
    }
    if (output[0]) {
        throw output[0];
    }
    return output[1];
};
//# sourceMappingURL=tools.js.map