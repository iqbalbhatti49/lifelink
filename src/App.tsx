import { Routes, Route } from 'react-router-dom';
import './globals.css';

// Forms files
import SigninForm from './_auth/forms/SigninForm';
import SignupForm from './_auth/forms/SignupForm';
// This file for Forms rendering
import AuthLayout from './_auth/AuthLayout';
// This file for Feed/Home rendering
import RootLayout from './_root/RootLayout';
// for Feed/Home all pages 
import { AllUsers, CreatePost, EditPost, Explore, Home, PostDetails, Profile, Saved, UpdateProfile } from './_root/pages';
// toast import
import { Toaster } from './components/ui/toaster';

const App = () => {
  return (
    <main className='flex h-screen'>
        <Routes>

            {/* public routes  */}
            <Route element={<AuthLayout />}>
                {/* Sign in page */}
                <Route path='/sign-in' element={<SigninForm />} />
                {/* Sign up page */}
                <Route path='/sign-up' element={<SignupForm />} />
            </Route>

            {/* private routes */}
            <Route element={<RootLayout />}>
                <Route index element={<Home />} /> {/* Home page */}
                <Route path='/explore' element={<Explore />} />
                <Route path='/saved' element={<Saved />} />
                <Route path='/all-users' element={<AllUsers />} />
                <Route path='/create-post' element={<CreatePost />} />
                <Route path='/update-post/:id' element={<EditPost />} />
                <Route path='/posts/:id' element={<PostDetails />} />
                <Route path='/profile/:id/*' element={<Profile />} />
                <Route path='/update-profile/:id' element={<UpdateProfile />} />
            </Route>
            
        </Routes>

        {/* toaster */}
        <Toaster />
    </main>
  )
}

export default App
