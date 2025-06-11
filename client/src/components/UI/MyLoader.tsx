import {ScaleLoader} from "react-spinners";

const MyLoader = () => {

  return (
    <div
      style={{
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        display: "flex"
      }}
    >
      <ScaleLoader color={'rgb(0, 0, 0)'} />
    </div>
  );
};

export default MyLoader;