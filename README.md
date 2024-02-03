# Cookie Report

this extension will monitor all tabs for cookies set during browsing.
Cookies will then get summarized inside report.

There are two types of cookies collected: "script" and "header". Cookies
set using script usually take form of:

```javascript
document.cookie = "name=value";
```

Cookies set by header arrive when the network content fetched contains
[Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
header.
