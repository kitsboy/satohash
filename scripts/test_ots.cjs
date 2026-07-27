const OpenTimestamps = require('opentimestamps');
const crypto = require('crypto');

async function test() {
    try {
        // Create a fake hash buffer
        const hashStr = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'; // empty sha256
        const hash = Buffer.from(hashStr, 'hex');
        
        console.log("Creating DetachedTimestampFile from hash...");
        const detached = OpenTimestamps.DetachedTimestampFile.fromHash(new OpenTimestamps.Ops.OpSHA256(), hash);
        
        console.log("Stamping...");
        await OpenTimestamps.stamp(detached);
        
        console.log("Stamping done. Getting info...");
        const infoResult = OpenTimestamps.info(detached);
        console.log("Info:", infoResult);
        
        const serialized = detached.serializeToBytes();
        console.log("Serialized size:", serialized.length);
        
        // Let's test upgrade
        console.log("Upgrading...");
        // A newly stamped file might not be upgradeable immediately.
        const upgraded = await OpenTimestamps.upgrade(detached);
        console.log("Upgraded:", upgraded); // true if any new info, false otherwise

        const verified = await OpenTimestamps.verify(detached, hash);
        console.log("Verified:", verified); // usually returns object with timestamps or undefined if pending

    } catch (e) {
        console.error("Error:", e);
    }
}
test();
