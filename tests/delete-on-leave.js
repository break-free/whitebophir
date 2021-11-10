const fs = require("../server/fs_promises.js");
const os = require("os");
const path = require("path");

const PORT = "8488";
const SERVER = 'http://localhost:' + PORT;
const URL = SERVER + '/boards/delete-on-leave';

let wbo_delete, data_path;

async function beforeEach(browser, done) {
    data_path = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'wbo-test-data-'));
    process.env["PORT"] = PORT;
    process.env["WBO_HISTORY_DIR"] = data_path;
    console.log("Launching WBO in " + data_path);
    wbo_delete = require("../server/server.js");
    done();
}

async function afterEach(browser, done) {
    wbo_delete.close();
    done();
}

function testDeleteOnRefreshWithOneUser(browser) {
    return browser
        .assert.titleContains('WBO')
        .click('.tool[title ~= Pencil]') // pencil
        .assert.cssClassPresent('.tool[title ~= Pencil]', ['curTool'])
        .executeAsync(async function (done) {
            function sleep(t) {
                return new Promise(function (accept) { setTimeout(accept, t); });
            }
            Tools.setColor('#123456');
            Tools.curTool.listeners.press(100, 200, new Event("mousedown"));
            await sleep(80);
            Tools.curTool.listeners.release(300, 400, new Event("mouseup"));
            done();
        })
        .assert.elementPresent("path[d='M 100 200 L 100 200 C 100 200 300 400 300 400'][stroke='#123456']")
        .refresh()
        .assert.not.elementPresent("path[d='M 100 200 L 100 200 C 100 200 300 400 300 400'][stroke='#123456']")
        .back()
}

// TODO: Dummy function that copies the same test as testDeleteOnRefreshWithOneUser.

function testDeleteOnRefreshWithTwoUsers(browser) {
    return browser
        .assert.titleContains('WBO')
        .click('.tool[title ~= Pencil]') // pencil
        .assert.cssClassPresent('.tool[title ~= Pencil]', ['curTool'])
        .executeAsync(async function (done) {
            function sleep(t) {
                return new Promise(function (accept) { setTimeout(accept, t); });
            }
            Tools.setColor('#123456');
            Tools.curTool.listeners.press(100, 200, new Event("mousedown"));
            await sleep(80);
            Tools.curTool.listeners.release(300, 400, new Event("mouseup"));
            done();
        })
        .assert.elementPresent("path[d='M 100 200 L 100 200 C 100 200 300 400 300 400'][stroke='#123456']")
        // Open new window, switch to it and navigate to URL
        .openNewWindow()
        .windowHandles(function (result) {
            var handle = result.value[1];
            browser.switchWindow(handle);
        })
        .url(URL)
        // Assert element present on second window, including after refresh
        .assert.elementPresent("path[d='M 100 200 L 100 200 C 100 200 300 400 300 400'][stroke='#123456']")
        .refresh()
        .assert.elementPresent("path[d='M 100 200 L 100 200 C 100 200 300 400 300 400'][stroke='#123456']")
        // Close second window and switch back to first window.
        .closeWindow()
        .windowHandles(function (result) {
            var handle = result.value[0];
            browser.switchWindow(handle);
        })
        // Assert element is still present, then after refresh has been deleted.
        .assert.elementPresent("path[d='M 100 200 L 100 200 C 100 200 300 400 300 400'][stroke='#123456']")
        .refresh()
        .assert.not.elementPresent("path[d='M 100 200 L 100 200 C 100 200 300 400 300 400'][stroke='#123456']")
        .back()
}

function testBoardDelete(browser) {
    var page = browser.url(URL)
        .waitForElementVisible('.tool[title ~= Pencil]') // pencil
    page = testDeleteOnRefreshWithOneUser(page);
    page = testDeleteOnRefreshWithTwoUsers(page);
    page.end();
}

module.exports = { beforeEach, testBoardDelete, afterEach };
