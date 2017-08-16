import React, { Component } from 'react';
import MyCropper from './component/MyCropper';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      iamge: '',
      imageLoaded: false,
    };
  }

  handleImageLoaded(state) {
    this.setState({
      [state + 'Loaded']: true
    });
  }

  render() {
    const src = "/img/twice.png";
    return (
      <div style={{
        width:'100%',
        height: 'auto',
        alignItems:'center',
        justifyContent:'center',
        display: 'flex',
        // border: '1px solid red',
        backgroundColor:'black'
      }}>
        <MyCropper ref="image" src={src} alt="" onImgLoad={() => this.handleImageLoaded('image')}
          originX={100}
          originY={100}
          fixedRatio={false}
        />
      </div>
    );
  }
}

export default App;
