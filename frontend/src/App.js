import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

import Form from 'react-bootstrap/Form';


function App() {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [username, setUsername] = useState(localStorage.getItem('username') || '');


    const handleLogout = () => {
        setToken('');
        setUsername('');
        localStorage.clear();

    };

    return (
        <Router>
            <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">CMS for Blogs by Varinder</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          <NavLink to="/" end><Button variant="outline-dark">Home</Button></NavLink>
                {!token ? (
                    <>
                        <NavLink to="/register"><Button variant="outline-dark">Register</Button></NavLink>
                        <NavLink to="/login"><Button variant="outline-dark">Login</Button></NavLink>
                    </>
                ) : (
                    <>
                        <NavLink to="/profile"><Button variant="outline-dark">Profile</Button></NavLink>
                        <NavLink to="/create-blog"><Button variant="outline-dark">Create Blog</Button></NavLink>
                        <button onClick={handleLogout} variant="outline-dark">Logout</button>
                    </>
                )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

            <Routes>
                <Route path="/" element={<BlogList />} />
                <Route path="/register" element={<Register setToken={setToken} setUsername={setUsername} />} />
                <Route path="/login" element={<Login setToken={setToken} setUsername={setUsername} />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/create-blog" element={<CreateBlog />} />
            </Routes>

            <footer>Copyright 2024 &copy; Varinder Pal Singh</footer>
        </Router>
    );
}

function BlogList() {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        axios.get('https://blogcms-3xag.onrender.com/blogs').then((response) => {
            setBlogs(response.data);
        });
    }, []);

    return (
        <div>
            <h1 className='text-center my-5'>All Blogs</h1>

            <div className='row' id='bloglist'>
                <div className='col-8 offset-2'>
                {blogs.map((blog, index) => (
                <div key={index}>
                    <hr></hr>
                    {blog.image && <img src={`https://blogcms-3xag.onrender.com/${blog.image}`} alt="Blog" width="100%" />}
                    <h2>{blog.title}</h2>
                    <p>{blog.content}</p>
                    <p>Author: {blog.author}</p>
                </div>
            ))}
                </div>
            </div>
            
        </div>
    );
}

function Register({ setToken, setUsername }) {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/register', formData).then(() => {
            navigate('/login');
        });
    };

    return (
        <div className='row my-5'>
            <div className='col-8 offset-2'>
            <h1>Register With Us</h1>

            <form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Control type="text" placeholder="Your Name" onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Control type="email" placeholder="Your Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Control type="password" placeholder="Password" onChange={(e) => setFormData({ ...formData, password: e.target.value })}/>
            </Form.Group>

            <div className="d-grid gap-2">
            <Button variant='outline-dark' type="submit" size="lg">Register</Button>
            </div>
        </form>
            </div>
        </div>
    );
}

function Login({ setToken, setUsername }) {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/login', formData).then((response) => {
            const { token, username } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
            setToken(token);
            setUsername(username);
            navigate('/profile');
        });
    };

    return (
        <div className='row my-5'>
        <div className='col-8 offset-2'>
                    

        <form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Control type="email" placeholder="Your Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        </Form.Group>
       
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Control type="password" placeholder="Password" onChange={(e) => setFormData({ ...formData, password: e.target.value })}/>
        </Form.Group>

        <div className="d-grid gap-2">
        <Button variant='outline-dark' type="submit" size="lg">Login</Button>
        </div>
    </form>
        </div>
    </div>
    );
}

function Profile() {
    const [profile, setProfile] = useState({});
    const [file, setFile] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('https://blogcms-3xag.onrender.com/profile', { headers: { Authorization: token } })
            .then(response => setProfile(response.data));
    }, []);

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('profileImage', file);

        const token = localStorage.getItem('token');
        axios.post('https://blogcms-3xag.onrender.com/update-profile', formData, {
            headers: { Authorization: token },
        }).then((response) => {
            setProfile(prevState => ({
                ...prevState,
                profileImage: response.data.profileImage
            }));
        });
    };

    return (
        <div>
            <h1>{profile.username}</h1>
            <img src={`https://blogcms-3xag.onrender.com/${profile.profileImage}`} alt="Profile" width="200" />
            <form onSubmit={handleProfileUpdate}>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                <button type="submit">Update Profile Image</button>
            </form>
        </div>
    );
}

function CreateBlog() {
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
      e.preventDefault();
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      if (file) formDataToSend.append('image', file);

      const token = localStorage.getItem('token');

      axios.post('https://blogcms-3xag.onrender.com/create-blog', formDataToSend, {
          headers: { Authorization: token },
      })
      .then(() => navigate('/'));
  };

  return (
      <div className='row my-5'>
        <div className='col-8 offset-2'>
        <h1>Create Post Form</h1>
        <form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Control type="text" value={formData.title}  placeholder="Title" onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" value={formData.content} placeholder="Content" onChange={(e) => setFormData({ ...formData, content: e.target.value })}></textarea>
            </Form.Group>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          
          <div className="d-grid gap-2 my-5">
            <Button variant='outline-dark' type="submit" size="lg">Create Post</Button>
            </div>
      </form>
        </div>
      </div>
  );
}


export default App;
