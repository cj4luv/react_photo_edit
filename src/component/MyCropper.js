import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import deepExtend from 'deep-extend';
import PropTypes from 'prop-types';

class MyCropper extends Component {
  constructor(props) {
    /**
   	 * @param number $ratio container ratio
     * @param bool $fixedRatio checked fixed ratio (1:1)
     * @param number $originX.Y 크랍 될 부분 중심 좌표
   	 */
    let {originX, originY, width, height, fixedRatio, ratio, styles} = props
    // console.log('originX', originX, 'originY', originY)
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
      // crroper original position(x axis,y axis), according to image left and top
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
    console.log('0.did mount')
    // event
    document.addEventListener('mousemove', this.handleDrag.bind(this))
    document.addEventListener('touchmove', this.handleDrag.bind(this))

    document.addEventListener('mouseup', this.handleDragStop.bind(this))
    document.addEventListener('touchend', this.handleDragStop.bind(this))

    this.imgGetSizeBeforeLoad()
  }

  // adjust image height when image size scaleing change, also initialize styles
  imgGetSizeBeforeLoad() {
    console.log('1.image before load')
    let that = this
    // trick way to get naturalwidth of image after component did mount
    setTimeout(() => {
      let img = ReactDOM.findDOMNode(that.refs.img)
      if(img && img.naturalWidth) {
        // image scaleing
        const {beforeImgLoad} = that.props

        // image scaleing
        let _heightRatio = img.offsetWidth / img.naturalWidth
        let height = parseInt(img.naturalHeight * _heightRatio, 10)

        // resize imgHeight
        that.setState({
          imgHeight: height,
          imgLoaded: true,
        }, () => that.initStyles())
        // before image loaded hook
        beforeImgLoad()
      } else if (img) {
        // catch if image naturalWidth is 0
        that.imgGetSizeBeforeLoad()
      }
    }, 0)
  }

  // initialize style, component did mount or component updated
  // 크랍 할 부분의 이미지 좌표와 출력될 이미지 부분
  initStyles() {
    console.log("2.init style")
    const container = ReactDOM.findDOMNode(this.refs.container);
    this.setState({
      imgWidth: container.offsetWidth
    }, () => {
      // calc frame widht height
      let {originX, originY, disabled} = this.props
      if(disabled) return
      const {imgWidth, imgHeight} = this.state
      let {frameWidth, frameHeight} = this.state

      const maxLeft = imgWidth - frameWidth
      const maxTop =  imgHeight - frameHeight

      if(originX + frameWidth >= imgWidth) {
        originX = imgWidth - frameWidth
        this.setState({originX})
      }
      if (originY + frameHeight >= imgHeight) {
        originY = imgHeight - frameHeight
        this.setState({originY})
      }

      this.setState({maxLeft, maxTop})
      // calc clone position
      this.calcPosition(frameWidth, frameHeight, originX, originY, () => {
        const {frameWidthStyle, frameHeightStyle, toImgTopStyle, toImgLeftStyle} = this.state
        this.setState({
          frameWidth: frameWidthStyle,
          frameHeight: frameHeightStyle,
          originX: toImgLeftStyle,
          originY: toImgTopStyle
        })
      })
    })
  }



  // judge whether to create new frame, frame or frame dot move accroding to action
  // 마우스 드래그 일때 실행
  handleDrag(e) {
    if(this.state.dragging) {
      e.preventDefault()
      let {action} = this.state
      if(!action) return this.createNewFrame(e)
    }
  }

  // starting dragging
  // 이미지 영역을 클릭 했을 때
  handleDragStart(e) {
    const {allowNewSelection} = this.props
    const action = e.target.getAttribute('data-action')
                    ? e.target.getAttribute('data-action')
                    : e.target.parentNode.getAttribute('data-action')

    const pageX = e.pageX ? e.pageX : e.targetTouches[0].pageX
    const pageY = e.pageY ? e.pageY : e.targetTouches[0].pageY

    // if drag or move or allow new selection, change startPageX, startPageY, dragging state
    if(action || allowNewSelection) {
      e.preventDefault()
      // drag start, set startPageX, startPageY for dragging start point
      this.setState({
        startPageX: pageX,
        startPageY: pageY,
        dragging: true,
        action
      })
      // console.log('drag start page position \n', 'pageX', pageX, 'pageY', pageY)
    }
    // if no action and allowNewSelection, then create a new frame
    if(!action && allowNewSelection) {
      let container = ReactDOM.findDOMNode(this.refs.container)
      const {offsetLeft, offsetTop} = container

      let originX = pageX - offsetLeft
      let originY = pageY - offsetTop

      let frameWidth = 2
      let frameHeight = 2

      this.setState({
        // set offset left and top of new frame
        originX: originX,
        originY: originY,
        frameWidth: frameWidth,
        frameHeight: frameHeight,
      }, () => this.calcPosition(frameWidth,frameHeight, originX, originY) )
      console.log("drag start origin position \n", "originX", originX, "originY", originY)
    }
  }

  // stop dragging
  handleDragStop(e) {
    if(this.state.dragging) {
      e.preventDefault()
      this.setState({
        dragging: false,
      })
    }
  }


  //image가 로드 된 이후로 실행 되는 함수
  imgOnLoad() {
    this.props.onImgLoad()
  }

  /**
   * @param number $pageX $pageY They return x,y position in all browoser page to include scroll area
   */
  // create a new frame, and drag, so frame widht and height is become larger
  // 마우스 드래그 일때 새로운 프레임 생성 부분
  createNewFrame(e) {
    if(this.state.dragging) {
      // click or touch event
      const pageX = e.pageX ? e.pageX : e.targetTouches[0].pageX
      const pageY = e.pageY ? e.pageY : e.targetTouches[0].pageY
      const {ratio, fixedRatio} = this.props
      const {frameWidth, frameHeight, startPageX, startPageY, originX, originY} = this.state

      // click or touch point's offset from source image top
      const _x = pageX - startPageX
      const _y = pageY - startPageY

      // frame new widht, height, left, top
      let _width = frameWidth + Math.abs(_x)
      let _height = fixedRatio ? (frameWidth + Math.abs(_x)) / ratio : frameHeight + Math.abs(_y)
      let _left = originX
      let _top = originY

      if(_y < 0) {
        // drag and resize to top, top changing
        _top = fixedRatio ? originY - Math.abs(_x) / ratio : originY - Math.abs(_y)
      }

      if(_x < 0) {
        // drag and resize, go to left, left changing
        _left = originX + _x
      }

      // console.log('create new frame', 'widht ', _width, 'height ', _height, 'left ', _left, 'top ', _top)

      // calc position
      return this.calcPosition(_width, _height, _left, _top)
    }
  }

  // frame widht, frame height, position left, position top
  calcPosition(width, height, left, top, callback) {
    const {imgWidth, imgHeight} = this.state
    const {ratio, fixedRatio} = this.props
    // width < 0 or height < 0, frame invalid
    if(width < 0 || height < 0) return false

    // if ratio is fixed
    if(fixedRatio) {
      // adjust by widht
      if(width / imgWidth > height / imgHeight) {
        if(width > imgWidth) {
          width = imgWidth
          left = 0
          height = width / ratio
        }
      } else {
        //adjust by height
        if(height > imgHeight) {
          height = imgHeight
          top = 0
          width = height * ratio
        }
      }
    }

    // frame widht plus offset left, larger than img's width
    if(width + left > imgWidth) {
      if(fixedRatio) {
        // if fixed ratio, adjust left with width
        left = imgWidth - width
      } else {
        // resize width with left
        width = width - ((width + left) - imgWidth)
      }
    }
    // frame height plus offset top, larger than img's height
    if(height + top > imgHeight) {
      if(fixedRatio) {
        // if fixed ratio, adjust top with height
        top = imgHeight - height
      } else {
        // resize height with top
        height = height - ((height + top) - imgHeight)
      }
    }
    // left is invalid
    if(left < 0) {
      left = 0
    }
    // top is invalid
    if(top < 0) {
      top = 0
    }
    // if frame width larger than img width
    if(width > imgWidth) {
      width = imgWidth
    }
    // if frame height larger than img height
    if(height > imgHeight) {
      height = imgHeight
    }
    this.setState({
      toImgLeftStyle: left,
      toImgTopStyle: top,
      frameWidthStyle: width,
      frameHeightStyle: height
    }, () => {
      if(callback) callback(this)
    })
    console.log('calc position \n','widht ', width, 'height ', height, 'left ', left, 'top ', top)
  }

  render() {
    const {dragging, imgHeight, imgWidth, styles, imgLoaded} = this.state
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
             position: 'relative',
             height: imgHeight
           })
          }
      >
        {imageNode}
        {imgLoaded ?
          <div>
            <div style={styles.modal}></div>
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

              {/*clone img*/}
              <div style={styles.clone}>
                <img src={src} crossOrigin="anonymous"
                  width={imgWidth} height={imgHeight}
                  style={deepExtend({},
                    styles.img,
                    {
                      marginLeft: -this.state.toImgLeftStyle,
                      marginTop: - this.state.toImgTopStyle
                    }
                  )}
                  ref='cloneImg'
                  alt={alt}
                />
              </div>
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
  allowNewSelection: true,
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

  clone: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'absolute',
    left: 0,
    top: 0,
  },

  source: {
    overflow: 'hidden'
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
    backgroundColor: '#222',
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
    opacity: .8,
  },
}

export default MyCropper;
