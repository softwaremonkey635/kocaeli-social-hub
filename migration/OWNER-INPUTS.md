# Owner inputs - Kocaeli Social Hub

These are the facts only the owner can supply. They mirror
`deploy/OWNER-REQUEST.md`, which is the original Turkish form. Answer each
item in one sentence and the deploy runbook can be finished.

## 1. Host panel

Which panel does the host use? cPanel, Plesk, hPanel, or something else?

## 2. Server software

Which web server runs on the host? Apache, LiteSpeed, Nginx, or unknown? If
unknown, ask the hosting company.

## 3. PHP availability

Is PHP enabled on the host? Some static hosting plans disable PHP, and then
`.htaccess` features that need it will not run.

## 4. Domain name

At which address will the site be published? For example
`kocaelisocialhub.com` or `www.kocaelisocialhub.com`. Should it work with
`www` or without?

## 5. DNS management

Where are the DNS records managed? At the domain registrar, the hosting
company, or elsewhere? The A record is changed there.

## 6. SSL status

Is an SSL certificate active? Was AutoSSL run in cPanel, or was a certificate
uploaded by hand? Is there no SSL yet?

## 7. Upload method

How will the files be uploaded? cPanel File Manager, FTP, SSH, or Git?

## 8. Contact

Which email address or contact form should be used to report changes?

## Build-time values the owner also decides

These are not secrets, but they change the build output:

- [ ] The production domain, to set `SITE_ORIGIN` (default `https://softwaremonkey635.github.io`).
- [ ] The deployment base, to set `APP_BASE` (default `/`; the GitHub Pages test build uses `/kocaeli-social-hub/`).
