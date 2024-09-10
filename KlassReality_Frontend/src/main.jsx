import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import store from "./redux/store.js";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { AuthProvider } from "./redux/useAuth.jsx";
import { ConfigProvider } from "antd";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#ba28a9",
      },
    }}
  >
    <Router>
      <Provider store={store}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Provider>
    </Router>
  </ConfigProvider>
);
