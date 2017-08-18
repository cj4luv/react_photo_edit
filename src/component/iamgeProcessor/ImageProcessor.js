import React, { Component } from 'react';
import effectsMap from './effects_map';
import PropTypes from 'prop-types';

class ImageProcessor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      src: props.src,
    };
  }

  componentWillReceiveProps(nextProps) {
    // console.log('will Receive Props', nextProps.effect)
    if (this.props.effect !== nextProps.effect) {
      this.applyEffect(nextProps.effect);
    }

    if(this.props.effect === 'brighten') {
      this.applyEffect(nextProps.effect);
    }
    else {
      this.setState({
        src: nextProps.src
      })
    }
  }

  componentDidMount() {
    // console.log('did mount')
    setTimeout(()=> {
      const isRendered = this.img.width > 0 && this.img.height > 0;
      if (isRendered) {
        this.applyEffect();
      }
    },0)
  }

  componentWillUnmount() {
    console.log('will unmount')
    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
    }
  }

  applyEffect(effect = this.props.effect) {
    // console.log('apply effect')
    if (effect === 'none') {
      this.setState({ src: this.props.src });
    } else {
      this.timeoutID = setTimeout(() => {
        this.getEffectAppliedImageData(effect)
          .then(src => this.setState({ src }))
          .catch(err => console.error(err)); // eslint-disable-line no-console
      }, 0);
    }
  }

  getSingletonCanvas(width, height) {
    let canvas;
    if (this.canvas) {
      canvas = this.canvas;
    } else {
      canvas = document.createElement('canvas'); // eslint-disable-line no-undef
    }
    canvas.width = width;
    canvas.height = height;
    // console.log('get canvas', canvas)
    return canvas;
  }

  getEffectAppliedImageData(effect) {
    return new Promise((resolve) => {

      const canvas = this.getSingletonCanvas(this.img.width, this.img.height);
      const context = canvas.getContext('2d');
      context.drawImage(this.img, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      const func = effectsMap[effect];
      func(imageData, this.props.options);

      context.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL());
    });
  }

  render() {
    // console.log('2. render')
    return (
      <img
        ref={img => this.img = img} // eslint-disable-line no-return-assign
        alt={this.props.alt}
        src={this.state.src}
      />
    );
  }
}


ImageProcessor.PropTypes = {
  alt: PropTypes.string.isRequired,
  effect: PropTypes.oneOf(Object.keys(effectsMap)),
  options: PropTypes.object,
  src: PropTypes.string.isRequired,
}

ImageProcessor.defaultProps = {
  effect: 'none'
}

export default ImageProcessor
