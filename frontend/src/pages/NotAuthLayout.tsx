import React from "react";

const NotAuthLayout = ({ children }: any) => {
  return (
    <div>
      <p>Header</p>
      <div>{children}</div>
      <p>Footer</p>
    </div>
  );
};

export default NotAuthLayout;
