# nodejs-email-server
NodeJs Email Sending Server


## How To Start Project 

### Pre Requirement 
1. Install NodeJs // https://nodejs.org/en/
2. Install apidoc global  `npm install apidoc -g` // Optional. http://apidocjs.com/

### Node module install 
1. `npm install` 

### Mongodb Server config 
2. go to config/db.js modify mongodb url 

* If you are mongodb running in locally. 
<pre>
eg : mongodb://localhost/node
</pre>

### Email Server config 
3. go to config/email.js modify server config 

* If you are using gmail server 
<pre>
    SERVER : {
        USER : "SERVER_USER",           // eg : example@gmail.com 
        PASSWORD : "SERVER_PASSWORD",   // eg : XXXXXXXXXX
        HOST : "SEVER_HOST"             // eg : smtp.gmail.com 
    },
    NO_REPLY_EMAIL : "SEVER_USER"       // eg : example@gmail.com
</pre>

### Start Project 
4. `npm start` 

Server start : http://localhost:2010

### API Doc Generate // Optional 
5. `npm run doc`

Server start : http://localhost:2010/apidoc

API Doc generation config in apidoc.json 
<pre>
    {
      "name": "NodeJs Email Server",
      "version": "1.0.0",
      "description": "NodeJs Email Sending Server",
      "apidoc": {
        "title": "NodeJs Email Sending Server",
        "url" : "http://localhost:2010"
      },
      "sampleUrl" : "http://localhost:2010"
    }
</pre>
Here API Doc UI : 
https://github.com/jdamilasp/nodejs-email-server/blob/master/ui/nodejsemailserverapidoc.png

### Contcat Info 
email : jdamilasp@gmail.com 
