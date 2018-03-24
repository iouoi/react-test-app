//import fetch from 'isomorphic-fetch';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Child from './Child';
import SunburstChart from './sunburst/SunburstChart';
import revData from './data/revenues.json';
import sunData from './data/sunburst.json';
import renderData from './data/renderTimes.json';
import flameData from './data/stacks.json';



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
      sunBurstData: [],
      activeBurst: null,
      revData,
      sunData,
      renderData,
      flameData,
    }
    this.handleClick = this.handleClick.bind(this);
    this.dataParser = this.dataParser.bind(this);
    this.handleBurstHover = this.handleBurstHover.bind(this);

  }

  // componentWillMount(){
  // 	console.log('mounted')
  // }

  // componentWillMount() {
  //   this.dataParser();
  // }

  handleClick() {
    this.setState({clicked: !this.state.clicked});
  }


  dataParser() {
    // const data = this.props.build
    const data = build;

    //loops through assets
    let i = this.props.activeBuild;
    let pathAry;
    let path;
    let sizeStr;
    let sunBurstData = [];


    for (var k = 0; k < data[i].chunks.length; k++) {
      for (var l = 0; l < data[i].chunks[k].modules.length; l++) {
        sizeStr = data[i].chunks[k].modules[l].size.toString();
        path = data[i].chunks[k].modules[l].name.replace("./", "");
        sunBurstData.push([path, sizeStr])
      }
    }
    return sunBurstData
  }

  handleBurstHover(path) {
    this.setState({ activeBurst: path });
  }
  


  render() {
    // const sunBurstData = this.dataParser();

    // const rectData = this.rectDataParser();
    const rectData = this.state.revData;
    const sunData = this.state.sunData;
    const flameData = this.state.flameData;

    if (this.state.clicked){
      return(
        <div>
          <button onClick={this.handleClick}>hide em</button>
          <Child/>
          <Child/>
          <SunburstChart rectData={rectData} sunData={sunData} flameData={flameData}/>
          {/* <SunburstChart data={sunBurstData} onHover={this.handleBurstHover}/> */}
        </div>
      )
    }else {
      return(
        <button onClick={this.handleClick}>show em</button>
        )
    }
  }

}

export default App;