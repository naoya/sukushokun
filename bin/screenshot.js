var props = {
  // Chrome
  pc:{
    ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36",
    viewport: { width: 2560, height: 1440 }
  },
  // iPhone 5, iOS 8.0.2
  mobile: {
    ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 8_0_2 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12A405 Safari/600.1.4",
    viewport: { width: 640, height: 1136 }
  }
};

var casper = require('casper').create();

var prop = casper.cli.args[1] == "mobile" ? props.mobile : props.pc;

casper.start();
casper.userAgent(prop.ua);
casper.zoom(2);
casper.open(casper.cli.args[0]).viewport(prop.viewport.width, prop.viewport.height).then(function () {
  console.log(this.captureBase64('png'));
});

casper.run();
