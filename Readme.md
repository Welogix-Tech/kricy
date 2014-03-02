Kricy
=====

Web MVC framework base on express.


Dependencies
============
See package.json

1.  Development enviroment use nodemon, compass.
2.  Production enviroment use pm2.


How to use
==========

`` git clone https://github.com/kurten/kricy.git ``develop on it, change and develop what you wanted.


Details
=======
>Project organize by folder. You just focus on app/controllers and app/views.
Config files in config folder, all module loader automaticlly. 
You can get a config by:
<pre><code>
    var config = require('../config');
    var appBase = config.get('app_base');
</code></pre>

>module init is in tools/init/

>hooks before page render tools/hooks/


start develop app just: `` node app.js `` or `` nodemon app.js ``

Other
=====
See http://ikurten.com/blog/2014/03/01/kai-fa-ri-zhi/
