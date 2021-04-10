# Battlelog/Keeper proxy

## Installation
- npm install
- npm start

## usage
There are two endpoints proxied by default 
 - localhost:3000/keeper/{keeper_url} - will proxy everything after battlelog to keeper.battlelog.com
 - localhost:3000/battlelog/{battlelog_url} - will proxy everything after battlelog to battlelog.battlefield.com

## Configs in config.json
- port // port to start the proxy on
- host // hostname to start the proxy on
- battlelog_url // battlelog url to proxy
- keeper_url // keeper url to proxy
- ratelimit // rate limit before either enforcing a hard limit or dripping requests
- rate_window // the limit window in ms, so every x rate_window limit to x ratelimit
- log_requests // 
- hard_limit // if the limit should be hard enforced rather than drip fed
