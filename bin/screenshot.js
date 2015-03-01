var casper = require('casper').create();

casper.start(casper.cli.args[0], function () {
  console.log(this.captureBase64('png'));
});

casper.run();
