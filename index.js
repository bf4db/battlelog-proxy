const config = require('./config.json')
const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');
const slowDown = require("express-slow-down");
const rateLimit = require("express-rate-limit");
const process = require('process');

// Configuration
const {
    port, // port to start the proxy on
    host, // hostname to start the proxy on
    battlelog_url, // battlelog url to proxy
    keeper_url, // keeper url to proxy
    ratelimit, // rate limit before either enforcing a hard limit or dripping requests
    rate_window, // the limit window in ms, so every x rate_window limit to x ratelimit
    log_requests, 
    hard_limit // if the limit should be hard enforced rather than drip fed
} = config;

const app = express();

if(log_requests) {
    app.use(morgan('short'));
}

const speedLimiter = slowDown({
    windowMs: rate_window,

    delayAfter: ratelimit,

    // begin adding 500ms of delay per request above 100:
    // request # 101 is delayed by  500ms
    // request # 102 is delayed by 1000ms
    // request # 103 is delayed by 1500ms
    // etc.
    delayMs: 500 
});
  

if(hard_limit) {
    const limiter = rateLimit({
        windowMs: rate_window,
        max: ratelimit
    });
    
    app.use(limiter);
}

app.use(speedLimiter);

app.use('/battlelog', createProxyMiddleware({
    target: battlelog_url,
    changeOrigin: true,
    headers: {
        'User-Agent': 'Battlelog Proxy',
    },
    pathRewrite: {
        [`^/battlelog`]: '',
    },
 }));

app.use('/keeper', createProxyMiddleware({
    target: keeper_url,
    changeOrigin: true,
    headers: {
        'User-Agent': 'Battlelog Proxy',
    },
    pathRewrite: {
        [`^/keeper`]: '',
    },
}));


let server = app.listen(port, host, () => {
    console.log(`Starting Proxy at ${host}:${port}`);
});
 
// Handle ^C
process.on('SIGINT', () => {
    server.close(() => {
        process.exit(0)
    })
});

  
