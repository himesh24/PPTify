var PPTify = (function () {
	var KeyFrames = {
		'MoveToLeft': { '100%': { 'transform': 'translateX(-100%)' } },
		'MoveToLeftFadeOut': { '100%': { 'opacity': 0.3, 'transform': 'translateX(-100%)' } },
		'MoveToRight': { '100%': { 'transform': 'translateX(100%)' } },
		'MoveToRightFadeOut': { '100%': { 'opacity': 0.3, 'transform': 'translateX(100%)' } },
		'MoveFromLeft': { '0%': { 'transform': 'translateX(-100%)' } },
		'MoveFromRight': { '0%': { 'transform': 'translateX(100%)' } },
		'ScaleDown': { '100%': { 'opacity': 0.1, 'transform': 'scale(0.7)' } },
		'ScaleUp': { '0%': { 'opacity': 0.1, 'transform': 'scale(0.7)' } },
		'RotateCubeLeft_Outside': { 
			'50%': { 'animation-timing-function': 'ease-out', 'transform': 'translateX(-50%) translateZ(-200px) rotateY(-45deg)' },
			'100%': { 'opacity': 0.3, 'transform': 'translateX(-100%) rotateY(-90deg)' }
		},
		'RotateCubeLeft_Inside': {
			'0%': { 'opacity': 0.3, 'transform': 'translateX(100%) rotateY(90deg)' },
			'50%': { 'animation-timing-function': 'ease-out', 'transform': 'translateX(50%) translateZ(-200px) rotateY(45deg)' }
		},
		'RotateCubeRight_Outside': { 
			'50%': { 'animation-timing-function': 'ease-out', 'transform': 'translateX(50%) translateZ(-200px) rotateY(45deg)' },
			'100%': { 'opacity': 0.3, 'transform': 'translateX(100%) rotateY(90deg)' }
		},
		'RotateCubeRight_Inside': {
			'0%': { 'opacity': 0.3, 'transform': 'translateX(-100%) rotateY(-90deg)' },
			'50%': { 'animation-timing-function': 'ease-out', 'transform': 'translateX(-50%) translateZ(-200px) rotateY(-45deg)' }
		},
		'RotateSideLeft_Outside': {
			'100%': { 'opacity': 0.3, 'transform': 'translateZ(-500px) rotateY(90deg)' }
		},
		'RotateSideLeft_Inside': {
			'0%': { 'opacity': 0.3, 'transform': 'translateZ(-500px) rotateY(-90deg)' }
		},
		'RotateUnfoldRight_Inside': {
			'0%': { 'opacity': 0.3, 'transform': 'translateX(100%) rotateY(90deg)' }
		},
		'FlipTop_Outside': {
			'100%': { 'opacity': 0.3, 'transform': 'translateZ(-1000px) rotateX(90deg)' }
		},
		'FlipTop_Inside': {
			'0%': { 'opacity': 0.3, 'transform': 'translateZ(-1000px) rotateX(-90deg)' }
		},
		'FlipBottom_Outside': {
			'100%': { 'opacity': 0.3, 'transform': 'translateZ(-1000px) rotateX(-90deg)' }
		},
		'FlipBottom_Inside': {
			'0%': { 'opacity': 0.3, 'transform': 'translateZ(-1000px) rotateX(90deg)' }
		}
	};
	
	function writeKeyFrames() {
		var style = $('<style/>').attr('type', 'text/css'),
			css = [];
		
		['', '-webkit-', '-moz-'].forEach(function (prefix) {
			for(var key in KeyFrames) {
				var keyframe = KeyFrames[key],
					opening = '@' + prefix + 'keyframes ' + key + ' { ',
					frames = [],
					closing = ' }';
				
				for(var pos in keyframe) {
					var attr = keyframe[pos],
						inner = [];
					
					for(var attrkey in attr) {
						if(['opacity'].indexOf(attrkey) < 0)
							inner.push(prefix + attrkey + ': ' + attr[attrkey] + ';');
						else
							inner.push(attrkey + ': ' + attr[attrkey] + ';');
					}
					
					frames.push(pos + ' { ' + inner.join(' ') + ' }');
				}
				
				css.push(opening + frames.join(' ') + closing);
			}	
		});
		
		style.text(css.join('\n'));
		$('head').append(style);
	}
	
	function SlideAnimation () {
		this._transformOrigin = { x: '50%', y: '50%', z: '0' };
		this._animation = {
			name: 'none',
			duration: '0',
			timing: 'ease',
			delay: '0',
			iteration: '1',
			fill_mode: 'none',
			play_state: 'running'
		};
		this._3d = false;
		this._stayTop = false;
	}
	
	SlideAnimation.prototype.translate3d = function () {
		this._3d = true;
		return this;
	};
	
	SlideAnimation.prototype.animation = function (name, duration, timing, delay, iteration, fill_mode, play_state) {
		if(name) this._animation.name = name;
		if(duration) this._animation.duration = duration;
		if(timing) this._animation.timing = timing;
		if(delay) this._animation.delay = delay || '0s';
		if(iteration) this._animation.iteration = iteration;
		if(fill_mode) this._animation.fill_mode = fill_mode;
		if(play_state) this._animation.play_state = play_state;
		return this;
	};
	
	SlideAnimation.prototype.transformOrigin = function (x_axis, y_axis, z_axis) {
		if(x_axis) this._transformOrigin.x = x_axis;
		if(y_axis) this._transformOrigin.y = y_axis;
		if(z_axis) this._transformOrigin.z = z_axis;
		return this;
	};
	
	SlideAnimation.prototype.stayTop = function () {
		this._stayTop = true;
		return this;
	};
	
	SlideAnimation.prototype.apply = function ($target, cb) {
		if(!$target) throw new Error('No animation target');
		
		var startcss = this.getAnimationStartObject(),
			endcss = this.getAnimationEndObject();
		
		var onanimationend = function () {
			$target.off('animationend');
			$target.off('webkitAnimationEnd');
			$target.css(endcss);
			cb && cb();
		};
		
		$target.css(startcss).on('animationend', onanimationend);	
		$target.css(startcss).on('webkitAnimationEnd', onanimationend);
	};
	
	SlideAnimation.prototype.reverse = function ($target, cb) {
		if(!$target) throw new Error('No animation target');
		
		var startcss = this.getReverseAnimationStartObject(),
			endcss = this.getAnimationEndObject();
		
		var onanimationend = function () {
			$target.off('animationend');
			$target.off('webkitAnimationEnd');
			$target.css(endcss);
			cb && cb();
		};
		
		$target.css(startcss).on('animationend', onanimationend);	
		$target.css(startcss).on('webkitAnimationEnd', onanimationend);
	};
	
	
	SlideAnimation.prototype.getAnimationStartObject = function () {
		return {
			'-webkit-transform-origin': [this._transformOrigin.x, this._transformOrigin.y, this._transformOrigin.z].join(' '),
			'-moz-transform-origin': [this._transformOrigin.x, this._transformOrigin.y, this._transformOrigin.z].join(' '),
			'transform-origin': [this._transformOrigin.x, this._transformOrigin.y, this._transformOrigin.z].join(' '),
			'-webkit-animation': [this._animation.name, this._animation.duration, this._animation.timing, this._animation.delay].join(' '),
			'-moz-animation': [this._animation.name, this._animation.duration, this._animation.timing, this._animation.delay].join(' '),
			'animation': [this._animation.name, this._animation.duration, this._animation.timing, this._animation.delay].join(' '),
			'z-index': (this._stayTop ? '999' : '')
		};
	};
	
	SlideAnimation.prototype.getReverseAnimationStartObject = function () {
		return {
			'-webkit-transform-origin': [this._transformOrigin.x, this._transformOrigin.y, this._transformOrigin.z].join(' '),
			'-moz-transform-origin': [this._transformOrigin.x, this._transformOrigin.y, this._transformOrigin.z].join(' '),
			'transform-origin': [this._transformOrigin.x, this._transformOrigin.y, this._transformOrigin.z].join(' '),
			'-webkit-animation': [this._animation.name, this._animation.duration, this._animation.timing, this._animation.delay, 'reverse'].join(' '),
			'-moz-animation': [this._animation.name, this._animation.duration, this._animation.timing, this._animation.delay, 'reverse'].join(' '),
			'animation': [this._animation.name, this._animation.duration, this._animation.timing, this._animation.delay, 'reverse'].join(' '),
			'z-index': (this._stayTop ? '999' : '')
		};
	};
	
	SlideAnimation.prototype.getAnimationEndObject = function () {
		return {
			'-webkit-transform-origin': '',
			'-moz-transform-origin': '',
			'transform-origin': '',
			'-webkit-animation': '',
			'-moz-animation': '',
			'animation': '',
			'z-index': ''
		};
	};
	
	var TransitionAnimationSet = {
		'OutToLeft_InFromRight': {
			current: new SlideAnimation().animation('MoveToLeft', '0.6s', 'ease', null, null, 'both'),
			next: new SlideAnimation().animation('MoveFromRight', '0.6s', 'ease', null, null, 'both')
		},
		'OutToRight_InFromLeft': {
			current: new SlideAnimation().animation('MoveToRight', '0.6s', 'ease', null, null, 'both'),
			next: new SlideAnimation().animation('MoveFromLeft', '0.6s', 'ease', null, null, 'both')
		},
		'CubicRotationLeft': {
			current: new SlideAnimation().translate3d().animation('RotateCubeLeft_Outside', '0.6s', 'ease-in', null, null, 'both').transformOrigin('100%', '50%', '0'),
			next: new SlideAnimation().translate3d().animation('RotateCubeLeft_Inside', '0.6s', 'ease-in', null, null, 'both').transformOrigin('0%', '50%', '0')			
		},
		'SidesRotationLeft': {
			current: new SlideAnimation().translate3d().animation('RotateSideLeft_Outside', '0.6s', 'ease-in', null, null, 'both').transformOrigin('-50%', '50%', '0'),
			next: new SlideAnimation().translate3d().animation('RotateSideLeft_Inside', '0.6s', 'ease-in', null, null, 'both').transformOrigin('150%', '50%', '0').stayTop()			
		},
		'CubicRotationRight': {
			current: new SlideAnimation().translate3d().animation('RotateCubeRight_Outside', '0.6s', 'ease-in', null, null, 'both').transformOrigin('0%', '50%', '0'),
			next: new SlideAnimation().translate3d().animation('RotateCubeRight_Inside', '0.6s', 'ease-in', null, null, 'both').transformOrigin('100%', '50%', '0')			
		},
		'OutScaleDown_InFromRight': {
			current: new SlideAnimation().animation('ScaleDown', '0.6s', 'ease', null, null, 'both'),
			next: new SlideAnimation().animation('MoveFromRight', '0.6s', 'ease', null, null, 'both').stayTop()
		},
		'OutToRight_InScaleUp': {
			current: new SlideAnimation().animation('MoveToRight', '0.6s', 'ease', null, null, 'both').stayTop(),
			next: new SlideAnimation().animation('ScaleUp', '0.6s', 'ease', null, null, 'both')
		},
		'OutToLeftFade_InFromUnfoldingRotationRight': { 
			current: new SlideAnimation().animation('MoveToLeftFadeOut', '0.6s', 'ease', null, null, 'both'),
			next: new SlideAnimation().translate3d().animation('RotateUnfoldRight_Inside', '0.6s', 'ease', null, null, 'both').transformOrigin('0%', '50%', '0').stayTop()
		},
		'FlipTop': {
			current: new SlideAnimation().animation('FlipTop_Outside', '0.5s', 'ease-out', null, null, 'both').transformOrigin('50%', '50%', '0'),
			next: new SlideAnimation().translate3d().animation('FlipTop_Inside', '0.5s', 'ease-out', '0.5s', null, 'both').transformOrigin('50%', '50%', '0')
		},
		'FlipBottom': {
			current: new SlideAnimation().animation('FlipBottom_Outside', '0.5s', 'ease-out', null, null, 'both').transformOrigin('50%', '50%', '0'),
			next: new SlideAnimation().translate3d().animation('FlipBottom_Inside', '0.5s', 'ease-out', '0.5s', null, 'both').transformOrigin('50%', '50%', '0')
		}
	};
	
	var pptify = function () { };
	
	pptify.prototype.init = function (options) {
		if(!options.first_slide_id) throw new Error('`first_slide_id` is not specified');
		
		this._options = options;
		this._options.slide = this._options.slide || '';
		this._options.next_slide_attribute = this._options.next_slide_attribute || 'data-next-slide';
		this._options.slide_transition_attribute = this._options.slide_transition_attribute || 'data-slide-transition';
		this._options.auto_transition_attribute = this._options.auto_transition_attribute || 'data-auto-transition';
		this._options.onload = this._options.onload || 'data-onload';
		
		this._isAnimating = false;
		$(document).ready(_.bind(_ready, this));
	};
	
	function _ready () {
		writeKeyFrames();
		
		$('body').css({ 'overflow': 'hidden', 'width': '100%', 'height': '100%', 'background-color': '#191919' });
		
		var slide_sequence = [],
			currentid = this._options.first_slide_id;
		
		if(this._options.slide) $(this._options.slide).css({ 'display': 'none' });	
		
		while(currentid) {
			var selector = this._options.slide + '#' + currentid,
				$elem = $(selector);
			
			slide_sequence.push(currentid);
			
			$elem.css({
				'position': 'absolute',
				'overflow': 'hidden',
				'left': 0,
				'right': 0,
				'display': 'none',
				'-webkit-transform': 'translate3d(0px, 0px, 0px)',
				'-moz-transform': 'translate3d(0px, 0px, 0px)',
				'transform': 'translate3d(0px, 0px, 0px)',
				'-webkit-transform-style': 'preserve-3d',
				'-moz-transform-style': 'preserve-3d',
				'transform-style': 'preserve-3d',
			});
			
			$elem.parent().css({
				'width': '100%',
				'height': '100%',
				'overflow': 'hidden',
				'-webkit-perspective': '1200px',
				'perspective': '1200px'
			});
			
			currentid = $elem.attr(this._options.next_slide_attribute);
		}
		
		if(slide_sequence.length == 0) return;
		
		this._slide_seq = slide_sequence;
		this._curr_seq = 0;
		
		this.$cur().show();
	
		$('body').click(_.bind(this.next, this));
		$('body').keyup(_.bind(_keyup, this));
	}
	
	function _keyup (e) {
		if(e.keyCode == 37) {
			this.prev();
			return;
		} else if (e.keyCode == 39) {
			this.next();
			return;
		}
	}
	
	pptify.prototype.$cur = function () {
		return $(this._options.slide + '#' + this._slide_seq[this._curr_seq]);
	};
	
	pptify.prototype.prev = function () {
		if(this._isAnimating) return console.log('animating...');
		if(this._curr_seq == 0) return console.log('first slide');
		
		this._isAnimating = true;
		
		console.log('transition from ' + this._options.slide + '#' + this._slide_seq[this._curr_seq] + ' to ' + this._options.slide + '#' + this._slide_seq[this._curr_seq - 1]);
		
		var $current = $(this._options.slide + '#' + this._slide_seq[this._curr_seq]),
			$prev = $(this._options.slide + '#' + this._slide_seq[--this._curr_seq]); 
		var transition_animation = $prev.attr(this._options.slide_transition_attribute),
			onload = $prev.attr(this._options.onload);
		
		if(transition_animation) {
			var _animation = TransitionAnimationSet[transition_animation]; 
			if(!_animation) throw new Error('Slide transition is not found: ' + transition_animation);
			
			var current_animation = false, next_animation = false;
			
			if(_animation.next) {
				current_animation = true;
				
				_animation.next.reverse($current, _.bind(function () {
					$current.css('display', 'none');
					if(current_animation && next_animation) this._isAnimating = false;
				}, this));
			} else {
				$current.css('display', 'none');	
			}
			
			if(_animation.current) {
				next_animation = true;
				
				$prev.css('display', '');
				_animation.current.reverse($prev, _.bind(function () {
					if(current_animation && next_animation) this._isAnimating = false;
				}, this));
			} else {
				$prev.css('display', '');	
			}
		} else {
			$current.css('display', 'none');
			$prev.css('display', '');
			
			this._isAnimating = false;
		}
		clearTimeout(autranTimer);
		if(onload) {
			console.log('execute function "'+onload+'"');
			window[onload]();
		}
	};
	
	var autranTimer;
	pptify.prototype.next = function () {
		if(this._isAnimating) return console.log('animating...');
		if(this._curr_seq + 1 == this._slide_seq.length) return console.log('end of slides');
		
		this._isAnimating = true;
		
		console.log('transition from ' + this._options.slide + '#' + this._slide_seq[this._curr_seq] + ' to ' + this._options.slide + '#' + this._slide_seq[this._curr_seq + 1]);
		
		var $current = $(this._options.slide + '#' + this._slide_seq[this._curr_seq]),
			$next = $(this._options.slide + '#' + this._slide_seq[++this._curr_seq]);
		var transition_animation = $current.attr(this._options.slide_transition_attribute),
			auto_transition = $next.attr(this._options.auto_transition_attribute),
			onload = $next.attr(this._options.onload);
		
		if(transition_animation) {
			var _animation = TransitionAnimationSet[transition_animation]; 
			if(!_animation) throw new Error('Slide transition is not found: ' + transition_animation);
			
			var current_animation = false, next_animation = false;
			
			if(_animation.current) {
				current_animation = true;
				
				_animation.current.apply($current, _.bind(function () {
					$current.css('display', 'none');
					if(current_animation && next_animation) this._isAnimating = false;
				}, this));
			} else {
				$current.css('display', 'none');	
			}
			
			if(_animation.next) {
				next_animation = true;
				
				$next.css('display', '');
				_animation.next.apply($next, _.bind(function () {
					if(current_animation && next_animation) this._isAnimating = false;
				}, this));
			} else {
				$next.css('display', '');	
			}
		} else {
			$current.css('display', 'none');
			$next.css('display', '');
			
			this._isAnimating = false;
		}

		clearTimeout(autranTimer);
		var self = this;
		if(auto_transition) {
			console.log('will go next in '+auto_transition+'ms');
			autranTimer = setTimeout(function() {
				self.next();
			},parseInt(auto_transition));
		}
		if(onload) {
			console.log('execute function "'+onload+'"');
			window[onload]();
		}
	};
	
	return new pptify;
})();