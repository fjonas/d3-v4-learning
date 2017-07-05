const opn = require("opn")
const express = require("express")
const app = express()
const rollup = require("rollup")
const path = require("path")
const fs = require("fs")

const babel = require("rollup-plugin-babel")
const resolve = require("rollup-plugin-node-resolve")

const entryPath = path.resolve(process.cwd(), "src.js")

let cache

const plugins = [
    resolve(),
    babel({
        exclude: "node_modules/**",
        presets: ["es2015-rollup"]
    }),
]

rollup.rollup({
    entry: entryPath,
    cache,
    plugins
}).then(function (bundle) {
    let result = bundle.generate({
        format: "iife"
    })
    cache = bundle

    fs.writeFileSync(path.resolve(process.cwd(), "built.js"), result.code)


}).catch(console.error)

setInterval(function () {
    rollup.rollup({
        entry: entryPath,
        cache,
        plugins
    }).then(function (bundle) {
        let result = bundle.generate({
            format: "iife"
        })
        cache = bundle

        fs.writeFileSync(path.resolve(process.cwd(), "built.js"), result.code)


    }).catch(console.error)
}, 1000)


app.use(express.static(process.cwd()))

app.listen(3000)

// opn("http://localhost:3000/index.html")