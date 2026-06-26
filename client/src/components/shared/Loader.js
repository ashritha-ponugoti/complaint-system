import React from 'react';

const Loader = ({ size = 'medium', fullScreen = false }) => {
  const spinner = <div className={`loader loader-${size}`}></div>;

  if (fullScreen) {
    return <div className="loader-fullscreen">{spinner}</div>;
  }

  return spinner;
};

export default Loader;