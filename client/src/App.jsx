import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import { store, persistor } from './config/store.js';
import { PersistGate } from 'redux-persist/integration/react';
import Home from './pages/Home';
import About from './pages/About';
import Profile from './pages/profile/index.jsx';
import SignIn from './pages/auth/SignIn.jsx';
import SignUp from './pages/auth/SignUp.jsx';
import NavBar from './components/Navigation.jsx';
import Footer from './components/Footer.jsx';
import { Provider } from 'react-redux';
import PrivateRoute from './components/PrivateRoute';
import ResultPage from './pages/listing/results.jsx';

function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <div className="flex flex-col min-h-screen">
                        <NavBar />
                        <main className="flex-grow min-h-screen">
                            <Routes>
                                <Route index path="/" element={<Home />}></Route>
                                <Route path="/results" element={<ResultPage />}></Route>
                                <Route path="/about" element={<About />}></Route>
                                <Route path="/signin" element={<SignIn />}></Route>
                                <Route path="/signup" element={<SignUp />}></Route>
                                <Route element={<PrivateRoute />}>
                                    <Route
                                        path="/profile/*"
                                        element={<Profile />}></Route>
                                </Route>
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </BrowserRouter>
            </PersistGate>
        </Provider>
    );
}

export default App;
