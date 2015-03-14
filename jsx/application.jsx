var React   = require('react');
var Fluxxor = require('fluxxor');
var request = require('superagent');
var Router  = require('react-router');

var Route       = Router.Route;
var RouteHandler = Router.RouteHandler;

var constants = {
  LOAD_SCREENSHOT:         "LOAD_SCREENSHOT",
  LOAD_SCREENSHOT_SUCCESS: "LOAD_SCREENSHOT_SUCCESS"
};

var ScreenshotClient = {
  isMobile: false,
  load: function(url, callback) {
    var endpoint = '/screenshot?url=' + encodeURIComponent(url);
    if (this.isMobile)
       endpoint += '&mobile=true';
    request.get(endpoint).end(callback);
  }
};

var actions = {
  takeScreenshot: function(url, isMobile) {
    this.dispatch(constants.LOAD_SCREENSHOT);
    ScreenshotClient.isMobile = isMobile;
    ScreenshotClient.load(url, function(err, response) {
      // FIXME: erro handling
      this.dispatch(constants.LOAD_SCREENSHOT_SUCCESS, {data:response.text});
    }.bind(this));
  }
};

var ScreenshotStore = Fluxxor.createStore({
  initialize: function() {
    this.screenshots = [];
    this.loading     = false;
    this.bindActions(
      constants.LOAD_SCREENSHOT,         this.onLoadScreenshot,
      constants.LOAD_SCREENSHOT_SUCCESS, this.onLoadScreenshotSuccess
    );
  },
  onLoadScreenshot: function() {
    this.loading = true;
    this.emit('change');
  },
  onLoadScreenshotSuccess: function(payload) {
    this.loading = false;
    var screenshot = { id:this.screenshots.length + 1, data:payload.data };
    this.screenshots = [screenshot].concat(this.screenshots);
    this.emit('change');
  },
  getState: function() {
    return {
      screenshots: this.screenshots,
      loading:     this.loading
    };
  }
});

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var App = React.createClass({
  mixins: [ Router.State, FluxMixin, StoreWatchMixin('ScreenshotStore') ],
  getInitialState: function() {
    return {
      url:         null,
      isMobile:    false,
    };
  },
  getStateFromFlux: function() {
    return this.getFlux().store("ScreenshotStore").getState();
  },
  componentDidMount: function() {
    this.handleUrl(this.getQuery().url);
  },
  takeScreenShot: function() {
    if (!this.state.url) {
      window.alert('URLを入力してね');
      return;
    }
    return this.getFlux().actions.takeScreenshot(this.state.url, this.state.isMobile);
  },
  handleUrl: function(value) {
    this.setState({ url: value });
  },
  handleMobileFlag: function(value) {
    this.setState({ isMobile: value });
  },
  render: function() {
    return (
      <div>
        <h1>スクショ撮る君</h1>
        <Form onSubmit={this.takeScreenShot}
              onUrlChange={this.handleUrl}
              onMobileFlagChange={this.handleMobileFlag}
              url={this.state.url} />
        <Indicator loading={this.state.loading} />
        <ScreenShotList screenshots={this.state.screenshots} />
        <RouteHandler />
      </div>
    );
  }
});

var Form = React.createClass({
  propTypes: {
    url:                React.PropTypes.string,
    onUrlChange:        React.PropTypes.func.isRequired,
    onMobileFlagChange: React.PropTypes.func.isRequired,
    onSubmit:           React.PropTypes.func.isRequired,
  },
  handleUrlChange: function(e) {
    this.props.onUrlChange(e.target.value);
  },
  handleMobileFlagChange: function(e) {
    this.props.onMobileFlagChange(e.target.checked);
  },
  handleButton: function() {
    this.props.onSubmit();
  },
  render: function() {
    return (
      <div>
        <input id="url" type="text" placeholder="http://" onChange={this.handleUrlChange} value={this.props.url} />
        <button id="btn-screenshot" onClick={this.handleButton}>撮る</button>
        <div>
          <input type="checkbox" id="is-mobile" onChange={this.handleMobileFlagChange} />
          <label htmlFor="is-mobile" onChange={this.handleMobileFlagChange}>スマートフォン</label>
        </div>
      </div>
    );
  }
});

var Indicator = React.createClass({
  propTypes: {
    loading: React.PropTypes.bool.isRequired
  },
  render: function() {
    if (this.props.loading) {
      return(      
        <span><img id="indicator" src="/images/ajax-loader.gif" /></span>
      );
    } else {
      return (
        <span></span>
      );
    }
  }
});

var ScreenShotList = React.createClass({
  render: function() {
    var screenshots = this.props.screenshots.map(function (screenshot) {
      return (
        <ScreenShot screenshot={screenshot} key={screenshot.id} />
      );
    }.bind(this));
    return (
      <div id="result">{screenshots}</div>
    );
  }
});

var ScreenShot = React.createClass({
  propTYpes: {
    screenshot: React.PropTypes.shape({
      id: React.PropTypes.number.isRequired,
      data: React.PropTypes.string.isRequired
    })
  },
  render: function() {
    var src = "data:image/png;base64," + this.props.screenshot.data;
    return (
      <img src={src} />
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={App} />
);

var stores = {
  ScreenshotStore: new ScreenshotStore()
};
var flux = new Fluxxor.Flux(stores, actions);

Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler flux={flux} />, document.getElementById('app-container'));
});
