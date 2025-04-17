export const getExpTimestamp = (seconds: number): number => ((): number => {
    const currentTimeMillis = Date.now();
    const secondsIntoMillis = seconds * 1000;
    const expirationTimeMillis = currentTimeMillis + secondsIntoMillis;

    return Math.floor(expirationTimeMillis / 1000);
})()