import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import deepExtend from 'deep-extend';
import PropTypes from 'prop-types';

class MyCropper extends Component {
  constructor(props) {
    /**
   	 * @param number $ratio container radio
     * @param bool $fixedRatio checked fixed radio
   	 */
    let {originX, originY, width, height, fixedRatio, ratio, styles} = props
    super(props);
    this.state = {
      // background image width and height
      imgWidth: '100%',
      imgHeight: 'auto',
      // cropper width and height, drag trigger changing
      frameWidthStyle: width,
      frameHeightStyle: fixedRatio ? (width/ratio): height,
      // cropper height, drag trigger changing
      toImgTopStyle:0,
      toImgLeftStyle:0,
      // crroper original position(x,y axis), accroding to image left and top (좌표)
      originX,
      originY,
      // dragging start, position's pageX and pageY
      startPageX:0,
      startPageY:0,
      // frame width and height, change only dragging stop
      frameWidth: width,
      frameHeight: fixedRatio ? (width/ratio): height,

      dragging: false,
      maxLeft: 0,
      maxTop: 0,
      action: null,
      imgLoaded: false,
      styles: deepExtend({}, defaultStyles, styles),
    };
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.handleDrag.bind(this))
    document.addEventListener('touchmove', this.handleDrag.bind(this))

    document.addEventListener('mouseup', this.handleDragStop.bind(this))
    document.addEventListener('touchend', this.handleDragStop.bind(this))

    this.imgGetSizeBeforeLoad()
  }

  componentWillUnmount() {
    console.log('unmout')
  }

  componentWillReceiveProps(nextProps) {
    // const {width, height, originX, originY} = this.props
    // console.log('nextprops');
  }

  // adjust image height when image size scaleing change, also initialize styles
  imgGetSizeBeforeLoad() {
    let that = this
    // trick way to get naturalwidth of image after component did mount
    setTimeout(() => {
      let img = ReactDOM.findDOMNode(that.refs.img)
      if(img && img.naturalWidth) {
        // image scaleing

        that.setState({
          imgLoaded: true,
        })
      }
    }, 0)
  }

  handleDrag(e) {
    //console.log(e);
  }

  handleDragStart(e) {

    e.preventDefault()
    // drag start, set startPageX, startPageY for dragging start point
    this.setState({
      dragging: true,
    })

    console.log('drag start',this.state.dragging);
  }

  handleDragStop(e) {
    if(this.state.dragging) {
      console.log('mouse up',this.state.dragging);
      e.preventDefault()
      this.setState({
        dragging: false,
      })
    }
  }

  imgOnLoad() {
    this.props.onImgLoad()
  }

  render() {
    const {dragging, imgHeight, imgWidth, styles, imgLoaded} = this.state
    const {src, alt} = this.props

    // console.log('image Loaded', dragging);

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
             position: 'relative',
             height: imgHeight
           })
          }
      >
        {imageNode}
        {imgLoaded ?
          <div>
            <div  style={styles.modal}></div>
            {/*frame container*/}
            <div ref='frameNode' style={
              deepExtend({},
              styles.frame,
              dragging ? styles.dragging_frame:{},
              {
                display:'block',
                left: this.state.toImgLeftStyle,
                top: this.state.toImgTopStyle,
                width: this.state.frameWidthStyle,
                height: this.state.frameHeightStyle
              }
            )}>

            </div>
          </div>
          : null
        }
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

  modal: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    opacity: .4,
    backgroundColor: '#222'
  },

  frame: {
    position:'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    display: 'none',
  },

  dragging_frame: {
    opacity: .0,
  }

}

export default MyCropper;
