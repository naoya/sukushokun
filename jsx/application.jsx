var React   = require('react');
var request = require('superagent');
var Router  = require('react-router');

var Route       = Router.Route;
var RouteHandler = Router.RouteHandler;

var App = React.createClass({
  mixins: [ Router.State ],

  getInitialState: function() {
    return {
      screenshots: [],
      loading:     false,
      url:         null
    };
  },

  componentDidMount: function() {
    this.handleUrl(this.getQuery().url);
  },
  
  takeScreenShot: function() {
    if (!this.state.url) {
      window.alert('URLを入力してね');
      return;
    }

    this.setState({ loading: true });

    var endpoint = '/screenshot?url=' + encodeURIComponent(this.state.url);
    // if ($('#is-mobile').prop('checked')) {
    //   endpoint += '&mobile=true';
    // }    

    request
      .get(endpoint)
      .end(function (err, response) {
        var screenshot = { id:3, data:response.text };
        this.setState({
          screenshots: [screenshot].concat(this.state.screenshots),
          loading:     false
        });     
      }.bind(this));
  },
  handleUrl: function(value) {
    this.setState({ url: value });
  },
  render: function() {
    return (
      <div>
        <h1>スクショ撮る君</h1>
        <Form onSubmit={this.takeScreenShot} onUrlChange={this.handleUrl} url={this.state.url} />
        <Indicator loading={this.state.loading} />
        <ScreenShotList screenshots={this.state.screenshots} />
        <RouteHandler />
      </div>
    );
  }
});

var Form = React.createClass({
  propTypes: {
    url:         React.PropTypes.string,
    onUrlChange: React.PropTypes.func.isRequired,
    onSubmit:    React.PropTypes.func.isRequired,
  },
  handleUrlChange: function(e) {
    this.props.onUrlChange(e.target.value);
  },
  handleButton: function() {
    this.props.onSubmit();
  },
  render: function() {
    return (
      <div>
        <input id="url" type="text" placeholder="http://" onChange={this.handleUrlChange} value={this.props.url} />
        <button id="btn-screenshot" onClick={this.handleButton}>撮る</button>
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

Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler />, document.getElementById('app-container'));
});
