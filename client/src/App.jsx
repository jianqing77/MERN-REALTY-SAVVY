import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import Home from './pages/Home';
import About from './pages/About';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import NavBar from './components/navbar';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/auth-reducer';

const store = configureStore({
    // configure the store
    reducer: {
        auth: authReducer, // pass in reducer to be used in the component
    },
});

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <NavBar />
                <Routes>
                    <Route index path="/" element={<Home />}></Route>
                    <Route path="/about" element={<About />}></Route>
                    <Route path="/profile" element={<Profile />}></Route>
                    <Route path="/signin" element={<SignIn />}></Route>
                    <Route path="/signup" element={<SignUp />}></Route>
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
