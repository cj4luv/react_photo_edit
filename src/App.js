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

  handleImageLoaded(state){
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
        border: '1px solid red',
        display: 'flex'
      }}>
        <MyCropper ref="image" src={src} alt="" onImgLoad={() => this.handleImageLoaded('image')}/>
      </div>
    );
  }
}

export default App;
