import NotificationProvider from "./components/Notification/Notification";
import MainRouter from "./Routes";

function App() {
  return (
    <>
      <NotificationProvider />
      <MainRouter />
    </>
  );
}

export default App;
