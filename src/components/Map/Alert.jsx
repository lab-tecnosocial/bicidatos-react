import PropTypes from 'prop-types';
import './Alert.css';

const Alert = ({ type, message, isVisible }) => {
  return (
    <div className={`alert ${type} ${isVisible ? 'show' : ''}`}>
      <div style={{display:"flex", gap:"5px", alignItems:"center", justifyContent:"center"}}>
        <svg style={{ fontSize: '25px' }} className="MuiSvgIcon-root MuiSvgIcon-fontSizeInherit css-1vooibu-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ErrorOutlineIcon"><path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path></svg>
        <p>{message}</p>
      </div>
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(['success', 'info', 'warning', 'error']).isRequired,
  message: PropTypes.string.isRequired,
};

export default Alert;
