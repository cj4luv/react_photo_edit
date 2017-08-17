import React, { Component } from 'react';
import MyCropper from './component/MyCropper';
import ImageProcessor from './component/iamgeProcessor/ImageProcessor';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '',
      imageLoaded: false,
      effect: 'none'
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

  handleChaingfilter(type) {
    this.setState({
      effect: type
    })
  }

  render() {
    const src = "/img/twice.png";

    return (
      <div style={{
        width:"500px",
        position:'absolute',
        // border: '1px solid red'
      }}>
        <div style={{
          width:'100%',
          height: 'auto'
        }}>
          <MyCropper ref="image" src={src} alt="" onImgLoad={() => this.handleImageLoaded('image')}
            originX={50}
            originY={50}
            fixedRatio={true}
            allowNewSelection={false}
            width={400}
            height={400}
          />
          <br />
          {this.state.imageLoaded ? <button onClick={() => this.handleClick('image')}>crop</button> : null}
          <h4>after crop</h4>
          {this.state.image ? <img src={this.state.image} alt=""/> : null}
        </div>

        <div>
          <ImageProcessor
            alt='react image sample'
            src={src}
            effect={this.state.effect}
          />

          <div>

            <button onClick={()=> this.handleChaingfilter('none')} style={styles.buttons}>
              none
            </button>

            <button onClick={()=> this.handleChaingfilter('grayscale')} style={styles.buttons}>
              Grayscale
            </button>

            <button onClick={()=> this.handleChaingfilter('lark')} style={styles.buttons}>
              lark
            </button>
          </div>


        </div>

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
