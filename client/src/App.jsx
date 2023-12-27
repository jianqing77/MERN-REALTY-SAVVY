import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import { store, persistor } from './config/store.js';
import { PersistGate } from 'redux-persist/integration/react';
import Home from './pages/Home';
import About from './pages/About';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import NavBar from './components/navbar';
import { Provider } from 'react-redux';
import PrivateRoute from './components/PrivateRoute';
import Example from './pages/test';

function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <NavBar />
                    <Routes>
                        <Route index path="/" element={<Home />}></Route>
                        <Route path="/about" element={<About />}></Route>
                        <Route path="/signin" element={<SignIn />}></Route>
                        <Route path="/signup" element={<SignUp />}></Route>
                        <Route path="/test" element={<Example />}></Route>
                        <Route element={<PrivateRoute />}>
                            <Route path="/profile" element={<Profile />}></Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </PersistGate>
        </Provider>
    );
}

export default App;
