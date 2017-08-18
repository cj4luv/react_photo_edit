import React, { Component } from 'react';
import MyCropper from './component/MyCropper';
import ImageProcessor from './component/iamgeProcessor/ImageProcessor';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '',
      imageLoaded: false,
      effect: 'none',

      cropFrameWidth: 400,
      cropFrameHeight: 400,

      cropFrameRatio: 1,

      croppedImageResize: {
        width:250,
        height:250,
      }
    };
  }

  handleImageLoaded(state) {
    this.setState({
      [state + 'Loaded']: true
    });
  }

  handleCrop(param){
    let node = this.refs[param];

    this.setState({
       [param]: node.crop(this.state.croppedImageResize)
    });

  }

  handleFilter(type) {
    this.setState({
      effect: type
    })
  }

  handleRatio(ratio) {
    this.setState({
      cropFrameRatio: ratio
    })
  }

  render() {
    const src = "/img/twice.png";

    return (
      <div style={{
        width:'500px',
        height: 'auto'
      }}>
        <MyCropper ref="image" src={src} alt="" onImgLoad={() => this.handleImageLoaded('image')}
          originX={50}
          originY={50}
          fixedRatio={true}
          allowNewSelection={false}
          width={this.state.cropFrameWidth}
          height={this.state.cropFrameHeight}
          ratio={this.state.cropFrameRatio}
        />

        <br />
        <h4>frame raito</h4>
        <div>
          <button onClick={()=>this.handleRatio(1)}>1:1</button>
          <button onClick={()=>this.handleRatio(4/3)}>4:3</button>
          <button onClick={()=>this.handleRatio(16/9)}>16:9</button>
          <button onClick={()=>this.handleRatio(91/50)}>1.85:1</button>
          <button onClick={()=>this.handleRatio(239/100)}>2.39:1</button>
        </div>

        <br />
        {this.state.imageLoaded ? <button onClick={() => this.handleCrop('image')}>crop</button> : null}
        <h4>after crop</h4>

        { this.state.image ?
          <div>
            <ImageProcessor
              alt='react image sample'
              src={this.state.image}
              effect={this.state.effect}
            />

            <div>

              <button onClick={()=> this.handleFilter('none')} style={styles.buttons}>
                none
              </button>

              <button onClick={()=> this.handleFilter('grayscale')} style={styles.buttons}>
                Grayscale
              </button>

              <button onClick={()=> this.handleFilter('lark')} style={styles.buttons}>
                lark
              </button>
            </div>

          </div>
          : null
        }
      </div>
    );
  }
}

let styles = {
  buttons: {
    width: '150px',
    height: '40px'
  }
}

export default App;
