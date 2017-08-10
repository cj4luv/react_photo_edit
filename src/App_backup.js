import React, { Component } from 'react';
import './App.less';
import Cropper from './component/Cropper';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      image: '',
      imageLoaded: false,
      image4: '',
      image4Loaded: false,
      image4BeforeLoaded: false,
      image4Values: ''
    }
  }

  handleImageLoaded(state){
    this.setState({
       [state + 'Loaded']: true
    });
   }

  handleBeforeImageLoad(state){
    this.setState({
       [state + 'BeforeLoaded']: true
    });
  }

  handleClick(state){
    let node = this.refs[state];
    this.setState({
       [state]: node.crop()
    });
  }

  handleChange(state, values){
    console.log(state, values)
    this.setState({
       [state + 'Values']: values
    });
  }

  handleGetValues(state){
    let node = this.refs[state];
    this.setState({
       [state + 'Values']: node.values()
    });
  }

  render() {
    const src = "/img/twice.png";
    return (
      <div style={{
        width:'1000px',
        alignItems:'center',
        justifyContent:'center',
        border: '1px solid red',
        display: 'flex'
      }}>
        <ul style={{
          width:'50pc',
          border: '1px solid green',
        }}>
          <li>
              <h3>Default image crop</h3>
              <Cropper src={src} ref="image" onImgLoad={() => this.handleImageLoaded('image')}/>
              <br/>
              {this.state.imageLoaded ? <button onClick={() => this.handleClick('image')}>crop</button> : null}
              <h4>after crop</h4>
              {this.state.image ? <img src={this.state.image} alt=""/> : null}
          </li>
          <li>
              <h3>{`Variable width and height, cropper frame is relative to natural image size, don't allow new
                  selection, set custom styles`}</h3>
              <Cropper src={src}
                       width={400}
                       height={400}
                       originX={200}
                       originY={200}
                       fixedRatio={false}
                       allowNewSelection={false}
                       onChange={values => this.handleChange('image4', values)}
                       styles={{
                           source_img: {
                               WebkitFilter: 'blur(3.5px)',
                               filter: 'blur(3.5px)'
                           },
                           modal: {
                               opacity: 0.5,
                               backgroundColor: '#fff'
                           },
                           dotInner: {
                               borderColor: '#ff0000'
                           },
                           dotInnerCenterVertical: {
                               backgroundColor: '#ff0000'
                           },
                           dotInnerCenterHorizontal: {
                               backgroundColor: '#ff0000'
                           }
                       }}
                       ref="image4"
                       onImgLoad={() => this.handleImageLoaded('image4')}
                       beforeImgLoad={() => this.handleBeforeImageLoad('image4')}
              />
              <br/>
              {this.state.image4BeforeLoaded ?
                  <button onClick={() => this.handleGetValues('image4')}>values</button> : null}
              <h4>values</h4>
              {this.state.image4Values ? <p>{JSON.stringify(this.state.image4Values)}</p> : null}
              {this.state.image4Loaded ? <button onClick={() => this.handleClick('image4')}>crop</button> : null}
              <h4>after crop</h4>
              {this.state.image4 ? <img src={this.state.image4} alt="나연"/> : null}
          </li>
        </ul>
      </div>
    );
  }
}

export default App;
