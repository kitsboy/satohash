// Quick env check: is opentimestamps loadable and can it verify a fixture?
const fs = require('fs')
const OpenTimestamps = require('opentimestamps')

function loadOtsFile(buf) {
  const DetachedTimestampFile = OpenTimestamps.DetachedTimestampFile
  return DetachedTimestampFile.deserialize(buf)
}

async function main() {
  console.log('OTS load ok; verify=', typeof OpenTimestamps.verify, 'info=', typeof OpenTimestamps.info, 'upgrade=', typeof OpenTimestamps.upgrade)
  const fixture = process.argv[2] || '/tmp/confirmed-0.ots'
  const buf = fs.readFileSync(fixture)
  console.log('fixture bytes:', buf.length)
  const detached = loadOtsFile(buf)
  const info = OpenTimestamps.info(detached)
  console.log('--- info (first 500 chars) ---')
  console.log(info.slice(0, 500))
  console.log('--- block regex match ---')
  const m = info.match(/Bitcoin block (\d+)/i)
  console.log('regex match:', m ? m[1] : null)
  try {
    const vr = await OpenTimestamps.verify(detached)
    console.log('verify result keys:', vr ? Object.keys(vr) : null, 'nonempty:', !!(vr && Object.keys(vr).length > 0))
  } catch (e) {
    console.log('verify threw:', e.message)
  }
}

main().catch((e) => {
  console.error('FATAL', e)
  process.exit(1)
})
