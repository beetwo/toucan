"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactPortalHoc = require("react-portal-hoc");

var _reactPortalHoc2 = _interopRequireDefault(_reactPortalHoc);

var _reactTapOrClick = require("react-tap-or-click");

var _reactTapOrClick2 = _interopRequireDefault(_reactTapOrClick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MentionMenu = function MentionMenu(props) {
  var active = props.active,
      className = props.className,
      Item = props.item,
      options = props.options,
      top = props.top,
      left = props.left,
      selectItem = props.selectItem,
      _props$style = props.style,
      style = _props$style === undefined ? {} : _props$style;

  var menuStyle = _extends({}, style, {
    left: left,
    top: top,
    position: "absolute"
  });
  return _react2.default.createElement(
    "div",
    { style: menuStyle, className: className },
    options.map(function (option, idx) {
      var select = selectItem(idx);
      return _react2.default.createElement(
        "div",
        _extends({ key: idx }, (0, _reactTapOrClick2.default)(select)),
        _react2.default.createElement(Item, _extends({ active: active === idx }, option))
      );
    })
  );
};

exports.default = (0, _reactPortalHoc2.default)({ clickToClose: true, escToClose: true })(MentionMenu);