PPTify
======

Usage
-----
```
<!DOCTYPE html>
<html>
<head>
<script src="JQUERY..."></script>
<script src="UNDERSCORE..."></script>
<script src="PPTify.js"></script>
<script>
PPTify.init({
	slide: 'section',
	first_slide_id: 'intro'
});
</script>
</head>
<body>
<article>
	<section id='intro' data-next-slide='slide2' data-slide-transition='SideRotationLeft'>Intro</section>
	<section id='slide2' data-next-slide='outro' data-slide-transition='OutToLeftFade_InFromUnfoldingRotationRight'>Slide2</section>
	<section id='outro'>Outro</section>		
</article>
</body>
</html>
```

List of slide transitions
-------------------------
Must specified in `data-slide-transition` attributes

```
{
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
  'SideRotationLeft': {
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
}
```


License
-------
MIT