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

      cropWidth: 400,
      cropHeight: 400,

      cropRatio: 1,
    };
  }

  handleImageLoaded(state) {
    this.setState({
      [state + 'Loaded']: true
    });
  }

  handleClick(state){
    let node = this.refs[state];
    this.setState({
       [state]: node.crop()
    });
  }

  handleFilter(type) {
    this.setState({
      effect: type
    })
  }

  handleRatio(ratio) {
    this.setState({
      cropRatio: ratio
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
          width={this.state.cropWidth}
          height={this.state.cropHeight}
          ratio={this.state.cropRatio}
        />

        <br />

        <div>
          <button onClick={()=>this.handleRatio(1)}>1:1</button>
          <button onClick={()=>this.handleRatio(4/3)}>4:3</button>
        </div>

        <br />
        {this.state.imageLoaded ? <button onClick={() => this.handleClick('image')}>crop</button> : null}
        <h4>after crop</h4>
        {/* {this.state.image ? <img src={this.state.image} alt=""/> : null} */}
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
