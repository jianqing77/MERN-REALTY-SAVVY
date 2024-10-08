import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import { store, persistor } from './config/store.js';
import { PersistGate } from 'redux-persist/integration/react';
import Home from './pages/Home';
import About from './pages/About';
import Terms from './pages/footer/Terms.jsx';
import Privacy from './pages/footer/Privacy.jsx';
import Profile from './pages/profile/index.jsx';
import SignIn from './pages/auth/SignIn.jsx';
import SignUp from './pages/auth/SignUp.jsx';
import NavBar from './components/Navigation.jsx';
// import Footer from './components/Footer.jsx';
import Footer from './components/foot.jsx';

import { Provider } from 'react-redux';
import PrivateRoute from './components/PrivateRoute';
import ResultPage from './pages/search-result-display/results.jsx';
import { LoadScript } from '@react-google-maps/api';
import ScrollToTop from './components/ScrollToTop.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ReactDOM from 'react-dom';
import React from 'react';

window.React2 = React;
console.log(window.React1 === window.React2);

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                    <BrowserRouter>
                        <ScrollToTop />
                        <div className="flex flex-col min-h-screen">
                            <NavBar />
                            <main className="flex-grow overflow-auto">
                                <Routes>
                                    <Route index path="/" element={<Home />}></Route>
                                    <Route
                                        path="/results"
                                        element={<ResultPage />}></Route>
                                    <Route path="/about" element={<About />}></Route>
                                    <Route path="/terms" element={<Terms />}></Route>
                                    <Route path="/privacy" element={<Privacy />}></Route>
                                    <Route path="/signin" element={<SignIn />}></Route>
                                    <Route path="/signup" element={<SignUp />}></Route>
                                    <Route element={<PrivateRoute />}>
                                        <Route
                                            path="/profile/*"
                                            element={<Profile />}></Route>
                                        {/* <Route path="/create"></Route> */}
                                    </Route>
                                </Routes>
                            </main>
                            <Footer />
                            {/* <ToastContainer /> */}
                        </div>
                    </BrowserRouter>
                </LoadScript>
            </PersistGate>
        </Provider>
    );
}

export default App;
