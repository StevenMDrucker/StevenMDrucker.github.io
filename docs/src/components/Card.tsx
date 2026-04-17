import parse from 'html-react-parser';

interface CardProps {
  theItem: any;
  mode: string;
  handleOver: (val: any) => void;
  handleOut: (val: any) => void;
  handleClick: (val: any) => void;
}

export function CardComponent({ theItem, mode, handleOver, handleOut, handleClick }: CardProps) {
  const val = theItem;

  if (mode === 'tile') {
    return (
      <div
        onMouseEnter={() => handleOver(val)}
        onMouseOut={() => handleOut(val)}
        onClick={() => handleClick(val)}
      >
        <img src={`https://stevenmdrucker.github.io/ResearchContent/${val.img}`} width="180" height="120" alt={val.caption} />
        {val.caption}
      </div>
    );
  }

  if (mode === 'details') {
    return (
      <div
        onMouseEnter={() => handleOver(val)}
        onMouseOut={() => handleOut(val)}
        onClick={() => handleClick(val)}
      >
        <div className="row">
          <div className="col-lg-2 col-sm-2 col-md-2">
            <div className="row">
              <img className="detailsImage" src={`https://stevenmdrucker.github.io/ResearchContent/${val.img}`} width="180" height="120" alt={val.caption} />
            </div>
            <div className="row" style={{ textAlign: 'left', margin: 5 }}>
              <a className="btn btn-primary btn-sm me-1" href={val.pdf}>Paper</a>
              {val.video !== '' && <a className="btn btn-primary btn-sm" href={val.video}>Video</a>}
            </div>
          </div>
          <div className="col-lg-10 col-sm-10 col-md-10">
            <div className="DCaption">{val.caption}</div>
            <div className="DReference">{parse(val.bibEntry || '')}</div>
            <div className="DAbstract">{val.abstract}</div>
          </div>
        </div>
      </div>
    );
  }

  // publication mode
  return (
    <div
      onMouseEnter={() => handleOver(val)}
      onMouseOut={() => handleOut(val)}
      onClick={() => handleClick(val)}
    >
      <div className="row">
        <div className="col-lg-12 col-sm-12 col-md-12">
          <span style={{ display: 'block', float: 'left', marginRight: '5px' }}>
            <a href={val.pdf}>PDF</a>
          </span>
          <span className="DReference">{parse(val.bibEntry || '')}</span>
        </div>
      </div>
    </div>
  );
}

export default CardComponent;
