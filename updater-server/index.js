const Koa = require('koa');
const Router = require('koa-router');
const staticServer = require('koa-static-server');
const compareVersions = require('compare-versions');
const multer = require('koa-multer');
const app = new Koa();
const router = new Router();
const uploadCrash = multer({ dest: 'crash/' })


router.post('/crash', uploadCrash.single('upload_file_minidump'), (ctx, next) => {
    console.log(ctx.req.body)
})

// 获取新版本
function getNewVersion(version) {
    if (!version) return null;
    // 数据库匹配，这里为了方便演示，mock数据处理
    let maxVersion = {
        name: '1.0.1',
        pub_date: '2022-11-08T12:15:53+1:00',
        notes: '新增功能AAA',
        url: `http://127.0.0.1:8080/public/Mercury-1.0.1-mac.zip`
    }
    if (compareVersions.compare(maxVersion.name, version, '>')) {
        return maxVersion
    }
    return null
}

router.get('/darwin', (ctx, next) => {
    // mac 更新
    // ?version=1.0.0
    const { version } = ctx.query;
    const newVersion = getNewVersion(version);
    if (newVersion) {
        ctx.body = newVersion
    } else {
        ctx.status = 204
    }
})

app.use(staticServer({ rootDir: 'public', rootPath: '/public' }))
app.use(router.routes()).use(router.allowedMethods());
app.listen(8080)