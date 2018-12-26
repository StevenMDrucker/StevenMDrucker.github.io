import * as React from 'react';
import  Slider  from 'react-slick';
import {  Grid, Row, Col, PanelGroup, Panel } from 'react-bootstrap';

const SandDanceImg = require("../../researchImages/SandDancePublic.jpg");
const TouchVisImg = require("../../researchImages/touchvis.png");


export class Feature extends React.Component<any, any> { 
    
    render() {
        var settings = {
            dots: true,
            infinite: true,
            adaptiveHeight: false,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1 
        };
        var imageStyle = {
              float: "left",
              margin: "0 20",
        }
        return (
            <Slider>
      <div>
          <h3>1</h3>
        </div>
        <div>
          <h3>2</h3>
        </div>
        <div>
          <h3>3</h3>
        </div>
        <div>
          <h3>4</h3>
        </div>
        <div>
          <h3>5</h3>
        </div>
        <div>
          <h3>6</h3>
        </div>
            </Slider>
        );
    }
}
