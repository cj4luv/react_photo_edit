import React, { Component } from 'react';
import ReactImageCrop from './component/ReactImageCrop';
import './component/ReactImageCrop.css';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
         image: null,
         online: false,
         refreshStatus: false,
         rectangleStatus: false,
         resizeStatus: true
     };
    this.onCropped = this._onCropped.bind(this);
    this.cropImage = this._cropImage.bind(this);
  }

  _onCropped(e) {
      if(this.state.refreshStatus){
          this.refs.image.src = e[0];
      }
      this.setState({image: e[0]});
  }

  _cropImage() {
      if(this.state.image!==null) this.refs.image.src = this.state.image;
  }

  render() {
    const src = "/img/twice.png";
    let _this = this;
    return (
      <div className="mainWindow">
        <div className="app">
            <div className="imageWindows">
                <div className="image1">
                  <ReactImageCrop borderStyle={"dashed #dddddd 2px"} onCrop={this.onCropped}
                                                        src={src}
                                                        square={this.state.rectangleStatus}
                                                        resize={this.state.resizeStatus}/></div>
                <div className="image2"><img ref="image" src={src} alt=""/></div>
            </div>
            <div className="settings">
                <div className="pnkt">
                    <label>
                        <button defaultChecked={this.state.refreshStatus}
                                onChange={()=>_this.setState({refreshStatus: !_this.state.refreshStatus})}/>
                        <span>Continuously refresh cropped image</span>
                    </label>
                </div>
                <div className="pnkt">
                    <label>
                        <button defaultChecked={this.state.rectangleStatus}
                                onChange={()=>_this.setState({rectangleStatus: !_this.state.rectangleStatus})}/>
                        <span>Activate rectangle</span>
                    </label>
                </div>
                <div className="pnkt">
                    <label>
                        <button defaultChecked={this.state.resizeStatus}
                                onChange={()=>_this.setState({resizeStatus: !_this.state.resizeStatus})}/>
                        <span>Resize cropped image</span>
                    </label>
                </div>
                <button className="button pnkt" onClick={this.cropImage}>Crop</button>
            </div>
        </div>
      </div>
    );
  }
}

export default App;
