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
      <div style={{
        width:"500px",
        position:'absolute'
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
      </div>

    );
  }
}

export default App;
