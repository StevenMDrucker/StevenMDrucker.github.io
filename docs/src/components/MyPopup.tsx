import parse from 'html-react-parser';

interface MyPopupProps {
  item: any | null;
  onClose: () => void;
}

export function MyPopup({ item, onClose }: MyPopupProps) {
  if (!item) return null;

  return (
    <>
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{ zIndex: 1040 }}
      />
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        style={{ zIndex: 1050 }}
        role="dialog"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{item.caption}</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
            </div>
            <div className="modal-body">
              <div className="text-center">
                <img
                  src={`https://stevenmdrucker.github.io/ResearchContent/${item.img}`}
                  width="400"
                  height="300"
                  alt={item.caption}
                />
              </div>
              <br />
              <div className="text-center">
                <a className="btn btn-primary btn-sm" href={item.pdf}>Paper</a>
                {item.video !== '' && (
                  <a className="btn btn-primary btn-sm ms-2" href={item.video}>Video</a>
                )}
              </div>
              <h6 style={{ textAlign: 'left', marginTop: '1rem' }}>
                Reference: {parse(item.bibEntry || '')}
              </h6>
              <p style={{ textAlign: 'left' }}>Abstract: {item.abstract}</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
