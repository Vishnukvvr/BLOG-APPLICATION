import React, { useState } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './Post.css'

const PostForm = ({ user, fetchPosts }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!title || !content) {
      setError('Title and content are required');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;

      if (image) {
        const imageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, 'posts'), {
        title,
        content,
        image: imageUrl,
        user: user.email,
        createdAt: new Date(),
      });

      fetchPosts(); // Fetch posts again after adding a new one

      // Clear form inputs
      setTitle('');
      setContent('');
      setImage(null);
      setSuccessMessage('Post created successfully!');
    } catch (error) {
      setError("Failed to upload post: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='post-form'>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Posting...' : 'Post'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </form>
    </div>
  );
};

export default PostForm;
