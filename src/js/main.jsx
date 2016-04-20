const React = require('react');
const ReactDOM = require('react-dom');
const R = require('ramda');

const MessageBox = React.createClass({
  render: function () {
    return (
      <div className="messageBox">
      </div>
    );
  }
});

ReactDOM.render(
  <MessageBox />,
  document.getElementById('message-box')
);