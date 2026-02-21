import { useEffect, useRef, useState, useCallback } from "react";
import { i as isBrowser, o as on, a as off } from "./util-Dl4_fw_3.js";
var useEffectOnce = function(effect) {
  useEffect(effect, []);
};
var useUnmount = function(fn) {
  var fnRef = useRef(fn);
  fnRef.current = fn;
  useEffectOnce(function() {
    return function() {
      return fnRef.current();
    };
  });
};
var useRafState = function(initialState) {
  var frame = useRef(0);
  var _a = useState(initialState), state = _a[0], setState = _a[1];
  var setRafState = useCallback(function(value) {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(function() {
      setState(value);
    });
  }, []);
  useUnmount(function() {
    cancelAnimationFrame(frame.current);
  });
  return [state, setRafState];
};
var useWindowSize = function(_a) {
  var _b = {}, _c = _b.initialWidth, initialWidth = _c === void 0 ? Infinity : _c, _d = _b.initialHeight, initialHeight = _d === void 0 ? Infinity : _d, onChange = _b.onChange;
  var _e = useRafState({
    width: isBrowser ? window.innerWidth : initialWidth,
    height: isBrowser ? window.innerHeight : initialHeight
  }), state = _e[0], setState = _e[1];
  useEffect(function() {
    if (isBrowser) {
      var handler_1 = function() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        setState({
          width,
          height
        });
        if (onChange)
          onChange(width, height);
      };
      on(window, "resize", handler_1);
      return function() {
        off(window, "resize", handler_1);
      };
    }
  }, []);
  return state;
};
export {
  useWindowSize as u
};
