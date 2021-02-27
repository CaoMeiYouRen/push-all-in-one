const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')
const glob = require('glob')

glob('dist/**/**', {
    ignore: ['dist', 'dist/index.d.ts', 'dist/**/*.js?(.map)']
}, (err, files) => {
    if (err) {
        console.error(err)
        return
    }
    remove(files)
})

/**
 *
 *
 * @author CaoMeiYouRen
 * @date 2021-02-27
 * @param {string[]} files
 */
async function remove(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (fs.existsSync(file)) {
            try {
                await asyncRimraf(file)
            } catch (error) {
                console.error(error)
            }
        }
    }
}

/**
 *
 *
 * @author CaoMeiYouRen
 * @date 2021-02-27
 * @param {string} path
 * @returns
 */
async function asyncRimraf(path) {
    return new Promise((resolve, reject) => {
        rimraf(path, (error) => {
            if (error) {
                reject(error)
            }
            resolve(true)
        })
    });
}