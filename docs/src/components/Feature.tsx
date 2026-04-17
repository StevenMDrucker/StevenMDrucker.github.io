import Slider from 'react-slick';
import SandDanceImg from '../../researchImages/SandDancePublic.jpg';
import TouchVisImg from '../../researchImages/touchvis.png';
import AtomImg from '../../researchImages/atom.png';

export function Feature() {
  const settings = {
    dots: true,
    infinite: true,
    adaptiveHeight: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true
  };

  return (
    <Slider {...settings}>
      <div className="featureDiv">
        <h2 className="featureTitle">SandDance</h2>
        <img className="featureImage" src={SandDanceImg} alt="SandDance" />
        <div className="featureText">
          SandDance is a browser based information visualization system prototype created at Microsoft.
          SandDance lets you see both the individual records, and their overall structure. SandDance focusses
          on natural user interaction techniques. Touch interaction is a first class citizen, allowing the
          entire experience to be easily operated through a touch screen. The system also understands speech
          commands for searching, selecting, focusing and filtering the data. A Kinect system can be used to
          sense gestures for moving between views of the data. Collaboration is supported by allowing multiple
          sets of people to interact with the same dataset.
        </div>
      </div>
      <div className="featureDiv">
        <h2 className="featureTitle">TouchVis</h2>
        <img className="featureImage" src={TouchVisImg} alt="TouchVis" />
        <div className="featureText">
          As more applications move from the desktop to touch devices like tablets, designers must wrestle
          with the costs of porting a design with as little revision of the UI as possible from one device
          to the other, or of optimizing the interaction per device. We consider the tradeoffs between two
          versions of a UI for working with data on a touch tablet. One interface is based on using the
          conventional desktop metaphor (WIMP) with a control panel, push buttons, and checkboxes where the
          mouse click is effectively replaced by a finger tap. The other interface (which we call FLUID)
          eliminates the control panel and focuses touch actions on the data visualization itself.
        </div>
      </div>
      <div className="featureDiv">
        <h2 className="featureTitle">Atom</h2>
        <img className="featureImage" src={AtomImg} alt="Atom" />
        <div className="featureText">
          A Grammar for Unit Visualizations: Unit visualizations are a family of visualizations where every
          data item is represented by a unique visual mark during visual encoding. For certain datasets and
          tasks, unit visualizations can provide more information, better match the user&apos;s mental model, and
          enable novel interactions compared to traditional aggregated visualizations. The resulting grammar
          is called Atom, and is based on passing data through a series of layout operations that divide the
          output of previous operations recursively until the size and position of every data point can be
          determined.
        </div>
      </div>
    </Slider>
  );
}
