import React, { Component } from 'react';
import deepExtend from 'deep-extend';
import PropTypes from 'prop-types';

class MyCropper extends Component {
  constructor(props) {
    let {styles} = props;
    super(props);
    this.state = {
      imgWidth: '100%',
      imgHeight: 'auto',
      styles: deepExtend({}, defaultStyles, styles),
    };
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.handleDrag.bind(this))
    document.addEventListener('touchmove', this.handleDrag.bind(this))
  }

  handleDrag(e) {
    //console.log(e);
  }

  handleDragStart(e) {
    console.log('드래그 스타트',e);
  }

  imgOnLoad() {
    this.props.onImgLoad()
  }

  render() {
    const {imgHeight, imgWidth, styles} = this.state
    const {src, alt} = this.props

    const imageNode = <div style={styles.source} ref="sourceNode">
        <img crossOrigin="anonymous"
            src={src} ref='img'
            style={deepExtend({}, styles.img, styles.source_img)}
            onLoad={this.imgOnLoad.bind(this)}
            width={imgWidth} height={imgHeight}
            alt={alt}
        />
    </div>

    return (
      <div ref="container" onMouseDown={this.handleDragStart.bind(this)}
           onTouchStart={this.handleDragStart.bind(this)}
           style= {
             deepExtend({},
             styles.container,
             {
               'position': 'relative',
               'height': imgHeight
             })
           }
      >
        {imageNode}
      </div>
    );
  }
}

MyCropper.PropTypes = {
  src: PropTypes.string.isRequired,
  originX: PropTypes.number,
  originY: PropTypes.number,
  ratio: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  fixedRatio: PropTypes.bool,
  allowNewSelection: PropTypes.bool,
  disabled: PropTypes.bool,
  styles: PropTypes.object,
  onImgLoad: PropTypes.function,
  beforeImgLoad: PropTypes.function,
  onChange: PropTypes.function,
}

MyCropper.defaultProps = {
  width: 200,
  height: 200,
  fixedRatio: true,
  ratio: 1,
  originX: 0,
  originY: 0,
  styles: {},
  onImgLoad: function () {},
  beforeImgLoad: function () {},
}

/*
default inline styles
*/
let defaultStyles = {
  container: {},
  img: {
    userDrag: 'none',
    userSelect: 'none',
    MozUserSelect: 'none',
    WebkitUserDrag: 'none',
    WebkitUserSelect: 'none',
    WebkitTransform: 'translateZ(0)',
    WebkitPerspective: 1000,
    WebkitBackfaceVisibility: 'hidden'
  },
  source_img: {
      float: 'left'
  },

}

export default MyCropper;
