import {join} from 'path'
import {readFileSync} from 'fs'

import React from 'react'
import yargs from 'yargs'
import express from 'express'
import favicon from 'serve-favicon'

import {renderComponent} from './lib/render'
import {routeMapping} from './lib/routes'


const
    {port, host, production: isProduction} = yargs
        .option('port', {
            description: 'Port to start listening HTTP-server on',
            default: 8001,
        })
        .option('host', {
            description: 'Host for HTTP-server',
            default: '127.0.0.1',
        })
        .option('production', {
            description: 'Run in production mode (will use production build)',
            default: false,
        })
        .argv,

    publicDir = isProduction
        ? join(__dirname, '..', 'build')
        : join(__dirname, '..', 'public'),

    render = renderComponent((result => ({
        pre: `${result[0]}<div id="root">`,
        post: `</div>${result[1]}`,
    }))(
        readFileSync(join(publicDir, 'index.html'))
            .toString()
            .replace(/%PUBLIC_URL%/g, '')
            .split('<div id="root"></div>')
    )),

    routes = routeMapping(render),
    app = express()

app.use(favicon(join(publicDir, 'favicon.ico')))
app.use('/img', express.static(join(publicDir, 'img')))

if (isProduction)
    app.use('/static/js', express.static(join(publicDir, 'static', 'js')))

app.get('/manifest.json', (req, res) => res.sendFile(join(publicDir, '/manifest.json')))

// boilerplate to add express.js handlers by iterating `routeMapping`
for (const route of Object.keys(routes)) {
    const x = routes[route]

    if (Array.isArray(x)) {
        for (const {method, handler} of x)
            app[method](route, handler)
    } else if (x !== null && typeof x === 'object') {
        app[x.method](route, x.handler)
    } else {
        throw new Error(
            `Unexpected mapped route ("${route}") handler type: ${typeof x}`)
    }
}

app.listen(port, host, () => {
    if (isProduction) console.info('Running in production mode...')
    console.debug(`Start listening HTTP-server on http://${host}:${port}...`)
})
