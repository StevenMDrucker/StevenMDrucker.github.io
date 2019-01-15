import * as React from 'react';
import * as RB from 'react-bootstrap';

import ReactHtmlParser from 'react-html-parser';

export class MyPopup extends React.Component<any, any> { 
       
  componentWillMount() {
      this.setState({ showModal: false, item: null });    
  }

  close() {
    this.setState({ showModal: false, item: null });    
  }

  open(itemVal) {
    this.setState({ showModal: true, item: itemVal });
  }

  render() {      
      if (this.state.item) {   
        return (
        <div>                
            <RB.Modal show={this.state.showModal} onHide={(e)=>this.close()}>
            <RB.Modal.Header closeButton>
                <RB.Modal.Title>{this.state.item.caption}</RB.Modal.Title>
            </RB.Modal.Header>
                
            <div className="center">
                <img src={"http://www.steven-drucker.com/client/" + this.state.item.img} width="400" height="300"></img>
            </div>
            <br />
            
            <div className="center">

                <RB.Button  bsSize="small" bsStyle="primary" href={this.state.item.pdf} >Paper</RB.Button>                
                {this.state.item.video != '' ? <RB.Button  bsSize="small" bsStyle="primary" href={this.state.item.video} >Video</RB.Button> : null}

            </div>
            <RB.Modal.Body>  
                <h6 style={{textAlign:"left"}} >Reference: {ReactHtmlParser(this.state.item.bibEntry)} </h6>
                <p style={{textAlign:"left"}}> Abstract: {this.state.item.abstract} </p>
            </RB.Modal.Body>
            <RB.Modal.Footer>
                <RB.Button onClick={(e)=>this.close()}>Close</RB.Button>
            </RB.Modal.Footer>
            </RB.Modal>
        </div>
        );
      } else {
          return (
        <div>                
            <RB.Modal show={this.state.showModal} onHide={(e)=>this.close()}>
            <RB.Modal.Header closeButton>
                <RB.Modal.Title>Modal heading</RB.Modal.Title>
            </RB.Modal.Header>
            <RB.Modal.Body>
                <h4>Text in a modal</h4>
                
                <h4>Overflowing text to show scroll behavior</h4>
                <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
                <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
                <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
                <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
                <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
                <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
                <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
                <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
                <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
            </RB.Modal.Body>
            <RB.Modal.Footer>
                <RB.Button onClick={(e)=>this.close()}>Close</RB.Button>
            </RB.Modal.Footer>
            </RB.Modal>
        </div>
          );
      }
  }
}
