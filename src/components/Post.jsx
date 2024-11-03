import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, deleteDoc, collection, addDoc, getDocs } from 'firebase/firestore';
import './Post.css'

const Post = ({ post, onDelete }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError('');
      try {
        const commentsCollection = collection(db, 'posts', post.id, 'comments');
        const commentSnapshot = await getDocs(commentsCollection);
        const commentList = commentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setComments(commentList);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError('Failed to load comments.');
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [post.id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      const commentData = { text: comment, createdAt: new Date() };
      const docRef = await addDoc(collection(db, 'posts', post.id, 'comments'), commentData);
      setComments([...comments, { id: docRef.id, ...commentData }]);
      setComment('');
    } catch (error) {
      console.error("Error adding comment:", error);
      setError('Failed to add comment.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteDoc(doc(db, 'posts', post.id, 'comments', commentId));
      setComments(comments.filter(c => c.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError('Failed to delete comment.');
    }
  };

  return (
    <div className='postform-display'>
      <h3>{post.title} by {post.user}</h3>
      {post.image && <img src={post.image} alt={post.title} style={{ maxWidth: '300px' }} />}
      <p>{post.content}</p>
      <button onClick={() => onDelete(post.id)} className='delect-web'>Delete Post</button>
      <h4>Comments:</h4>
      {loading ? <p>...</p> : error ? <p style={{ color: 'red' }}>{error}</p> : (
        <ul>
          {comments.map(c => (
            <li key={c.id}>
              {c.text}
              <button onClick={() => handleDeleteComment(c.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleCommentSubmit} className='form-web'>
        <input
          type="text"
          placeholder="Add a comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <button type="submit">Comment</button>
      </form>
    </div>
  );
};

export default Post;
