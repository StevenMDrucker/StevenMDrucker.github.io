import Slider from 'react-slick';
import SandDanceImg from '../../researchImages/SandDancePublic.jpg';
import TouchVisImg from '../../researchImages/touchvis.png';
import AtomImg from '../../researchImages/atom.png';

const slides = [
  {
    title: 'SandDance',
    img: SandDanceImg,
    text: `SandDance is a browser-based information visualization system created at Microsoft.
           It lets you see both the individual records and their overall structure, focusing on
           natural user interaction techniques. Touch interaction is a first-class citizen,
           allowing the entire experience to be easily operated through a touch screen. The system
           also understands speech commands for searching, selecting, focusing, and filtering data.
           A Kinect system can be used to sense gestures for moving between views. Collaboration
           is supported by allowing multiple sets of people to interact with the same dataset.`,
  },
  {
    title: 'TouchVis',
    img: TouchVisImg,
    text: `As more applications move from the desktop to touch devices like tablets, designers must
           wrestle with the costs of porting a UI from one device to the other, or of optimizing
           the interaction per device. We consider the tradeoffs between two versions of a UI for
           working with data on a touch tablet: one based on the conventional desktop metaphor (WIMP)
           with a control panel and push buttons, and another (FLUID) that eliminates the control
           panel and focuses touch actions directly on the data visualization itself.`,
  },
  {
    title: 'Atom',
    img: AtomImg,
    text: `A Grammar for Unit Visualizations: unit visualizations are a family of visualizations
           where every data item is represented by a unique visual mark during visual encoding.
           For certain datasets and tasks, unit visualizations can provide more information, better
           match the user's mental model, and enable novel interactions compared to traditional
           aggregated visualizations. The resulting grammar, Atom, is based on passing data through
           a series of layout operations that divide the output of previous operations recursively
           until the size and position of every data point can be determined.`,
  },
];

export function Feature() {
  const settings = {
    dots: true,
    infinite: true,
    adaptiveHeight: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: false,
  };

  return (
    <div className="feature-outer">
      <div style={{ width: '100%' }}>
        <Slider {...settings}>
          {slides.map(slide => (
            <div key={slide.title}>
              <div className="feature-slide">
                <h2 className="feature-title">{slide.title}</h2>
                <div className="feature-body">
                  <img className="feature-img" src={slide.img} alt={slide.title} />
                  <p className="feature-text-body">{slide.text}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
