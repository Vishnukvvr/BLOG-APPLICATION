import React, { useEffect, useState } from 'react';
import { db, auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import PostForm from './components/PostForm';
import Post from './components/Post';
import './components/Login.css'
import './components/Post.css'

const App = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchPosts(); 
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const postCollection = collection(db, 'posts');
      const postSnapshot = await getDocs(postCollection);
      const postList = postSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postList);
    } catch (err) {
      setError('Failed to fetch posts.');
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id) => {
    await deleteDoc(doc(db, 'posts', id));
    fetchPosts();
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div>
      {user ? (
        <>
          <h1 className='blog-web'>Blog Application</h1>
          <PostForm user={user} fetchPosts={fetchPosts} />
          <button onClick={handleLogout} className='logout-btn'>Logout</button>
          {loading ? (
            <p className='p-web'>Loading posts...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <Post key={post.id} post={post} onDelete={deletePost} />
            ))
          ) : (
            <p className='p-web'>No posts available</p>
          )}
        </>
      ) : (
        <>
          {showSignUp ? (
            <SignUpForm setUser={setUser} />
          ) : (
            <LoginForm setUser={setUser} />
          )}
          <div className='btn-login'>
          <button onClick={() => setShowSignUp(!showSignUp)} className='btn1'>
            {showSignUp ? 'Login': 'Create an account'}
          </button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
