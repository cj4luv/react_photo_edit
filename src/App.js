import React, { Component } from 'react';
import MyCropper from './component/MyCropper';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '',
      imageLoaded: false,
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


  render() {
    const src = "/img/twice.png";

    return (
      <div style={{width:'50pc',}}>
        <MyCropper ref="image" src={src} alt="" onImgLoad={() => this.handleImageLoaded('image')}
          originX={150}
          originY={100}
          fixedRatio={false}
        />
        <br />
        {this.state.imageLoaded ? <button onClick={() => this.handleClick('image')}>crop</button> : null}
        <h4>after crop</h4>
        {this.state.image ? <img src={this.state.image} alt=""/> : null}

      </div>
    );
  }
}

export default App;
