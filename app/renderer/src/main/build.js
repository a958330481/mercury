const fse = require('fs-extra')
const dest = '../../pages/main'
fse.removeSync(dest)
fse.moveSync('./build', '../../pages/main')