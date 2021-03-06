# The Internet Is For Porn

A bunch of websites built on top of React.js framework and its ecosystem with shared codebase
between them.

## Status

_In development…_

## Websites

- [Video Section](sites/videosection/) (status: _in development…_)
- [XXXVogue](sites/xxxvogue/) (status: _early prototyping…_)

## Documentation

- [Style guide](docs/style-guide.md)
- [About our redux store](docs/redux-store.md)
- [About helpers](docs/helpers.md)
- [Server-Side Rendering](docs/server-side-rendering.md)

## Recommended working environment

```bash
node --version # v10.14.1
npm --version # 6.4.1
```

Which are obtained by using `nvm`:

```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
exec bash
nvm install --lts
```

## Usage

Keep in mind that front-end depends on SSR because SSR proxying requests to the backend
(it also rearranges and filtering huge amounts of data, because backend designed that way).
So you just need to start both front-end development server and SSR service in parallel.

_P.S. Keep in mind that you supposed to run these commands being inside a site directory,
like this one: [`sites/videosection/`](sites/videosection/)._

1. Start SSR:

   ```bash
   make start-ssr
   ```

2. Start front-end development server:

   ```bash
   make start-dev-server
   ```

### Production

An example of __systemd__ service for the __Video Section__ website
(`/etc/systemd/system/videosection-ssr-worker@.service`):

```systemd
[Unit]
Description=VideoSection SSR Worker - Node.js based Servers-Side-Rendering service [ worker port: %I ]
After=multi-user.target

[Service]
WorkingDirectory=/home/videosectionssr/project/the-internet-is-for-porn
Type=simple

# For production
ExecStart=/bin/bash ./sites/videosection/launch.sh --port=%i

# Or use this instead if it's running on Release Candidate/testing server
# (to prevent search engines from indexing it).
#ExecStart=/bin/bash ./sites/videosection/launch.sh --rc --port=%i

#Restart=on-failure

StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=videosection-ssr-worker

User=videosectionssr
Group=videosectionssr

[Install]
WantedBy=multi-user.target
```

To add workers aliased to specific ports (9001–9004):

```bash
cd /etc/systemd/system/multi-user.target.wants/
ln -s /etc/systemd/system/videosection-ssr-worker@.service videosection-ssr-worker@9001.service
ln -s /etc/systemd/system/videosection-ssr-worker@.service videosection-ssr-worker@9002.service
ln -s /etc/systemd/system/videosection-ssr-worker@.service videosection-ssr-worker@9003.service
ln -s /etc/systemd/system/videosection-ssr-worker@.service videosection-ssr-worker@9004.service
```

To restart all workers:

```bash
systemctl restart videosection-ssr-worker@900*
```

To see if all of them working:

```bash
systemctl status videosection-ssr-worker@900*
```
