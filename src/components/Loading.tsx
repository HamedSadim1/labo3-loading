import React, { FC, useState, Fragment } from "react";

import { FidgetSpinner } from "react-loader-spinner";

const Loading = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleLoading: React.MouseEventHandler<HTMLButtonElement> = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  const loadingPage = loading ? (
    <FidgetSpinner
      visible={true}
      height="80"
      width="80"
      ariaLabel="dna-loading"
      wrapperStyle={{}}
      wrapperClass="dna-wrapper"
      ballColors={["#ff0000", "#00ff00", "#0000ff"]}
      backgroundColor="#F4442E"
    />
  ) : (
    false
  );

  return (
    <Fragment>
      <div>
        {loading ? (
          loadingPage
        ) : (
          <button onClick={handleLoading}>start loading</button>
        )}
      </div>
    </Fragment>
  );
};

export default Loading;
