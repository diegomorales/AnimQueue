/* eslint-disable no-unused-vars */

'use strict';

var _qid = -1,

    AnimQueue = function(args) {
        args = args || {};

        var _queue = [],
            _timeouts = [],
            _animationId,
            _now,
            _delta,
            _then = Date.now(),
            _fps,
            _removeDelay = args.removeDelay || 0,
            _interval,
            _isAnimating = false,

            _execQueue = function() {
                for (var j = _queue.length; j--;) {
                    _queue[j]();
                }
            },

            _startAnimQueue = function() {
                _animationId = requestAnimationFrame(_startAnimQueue);

                if (_fps !== 60) {
                    _now = Date.now();
                    _delta = _now - _then;

                    if (_delta > _interval) {
                        _then = _now - (_delta % _interval);

                        // execute all functions in queue
                        _execQueue();
                    }
                } else {
                    // execute all functions in queue
                    _execQueue();
                }
            },

            _setInterval = function() {
                _interval = 1000 / _fps;
            },

            _remove = function(func) {
                for (var i = _queue.length; i--;) {
                    if (_queue[i] === func) {
                        _queue.splice(i, 1);
                    }
                }

                if (_timeouts.length) {
                    for (var t = _timeouts.length; t--;) {
                        if (_timeouts[t].func === func) {
                            _timeouts.splice(t, 1);
                        }
                    }
                }

                if (!_queue.length) {
                    cancelAnimationFrame(_animationId);
                    _isAnimating = false;
                }
            },

            _setFramerate = function(fps) {
                if (fps < 0) {
                    fps = 0;
                }

                if (fps > 60) {
                    fps = 60;
                }

                _fps = fps;

                _setInterval();
            },

            _setRemoveDelay = function(ms) {
                _removeDelay = ms;
            },

            _addToQueue = function(func) {
                if (typeof func !== 'function') {
                    return false;
                }

                if (_queue.indexOf(func) > -1) {

                    // don't add it. cancel timeout for queue removal.
                    for (var i = _timeouts.length; i--;) {
                        if (_timeouts[i].func === func) {
                            clearTimeout(_timeouts[i].timeoutId);
                            _timeouts.splice(i, 1);
                        }
                    }
                } else {
                    _queue.push(func);
                }

                if (_queue.length === 1) {
                    _startAnimQueue();
                    _isAnimating = true;
                }

                return true;
            },

            _removeFromQueue = function(func, withDelay) {
                if (withDelay) {
                    var timeoutId = setTimeout(function() {
                        _remove(func);
                    }, _removeDelay);

                    _timeouts.push({
                        timeoutId: timeoutId,
                        func: func
                    });
                } else {
                    _remove(func);
                }
            };

        _setFramerate(args.framerate || 60);
        _setInterval();

        this._qid = ++_qid;
        this.addToQueue = _addToQueue;
        this.removeFromQueue = _removeFromQueue;
        this.setFramerate = _setFramerate;
        this.setRemoveDelay = _setRemoveDelay;
        this.isAnimating = function() {
            return _isAnimating;
        };

        Object.defineProperty(this, 'framerate', {
            get: function() {
                return _fps;
            },

            set: _setFramerate
        });
    };
