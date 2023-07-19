import { useState, useEffect } from 'react'
//import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Blogs from './components/Blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  //const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState({ messageType: '', messageText: null })
  //const [blogFormVisible, setBlogFormVisible] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    //console.log(loggedUserJSON)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      //console.log(user)
      setUsername('')
      setPassword('')
      setMessage({ ...message, messageType: 'success', messageText: 'Login successful' })
      setTimeout(() => {
        setMessage({ ...message, messageType: 'error', messageText: null })
      }, 5000)
    } catch (exception) {
      setMessage({ ...message, messageType: 'error', messageText: 'Wrong credentials' })
      setTimeout(() => {
        setMessage({ ...message, messageType: 'error', messageText: null })
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = (b) => {
    blogService
      .create(b)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))

        setMessage({ ...message, messageType: 'success', messageText: `Added blog ${b.title}` })
        setTimeout(() => {
          setMessage({ ...message, messageType: 'error', messageText: null })
        }, 5000)
      })
      // eslint-disable-next-line no-unused-vars
      .catch(error => {
        setMessage({ ...message, messageType: 'error', messageText: 'Failed to add blog, check fields' })
        setTimeout(() => {
          setMessage({ ...message, messageType: 'error', messageText: null })
        }, 5000)
        setBlogs(blogs.filter(b => b.id !== b.id))
      })
  }

  const addLike = (b) => {
    const blog = blogs.find(blog => blog.title === b.title)
    const changedBlog = { ...blog, likes: b.likes+1 }

    blogService
      .update(changedBlog.id, changedBlog)
      .then(returnedBlog => {
        //console.log(returnedBlog)
        returnedBlog.user=changedBlog.user
        setBlogs(blogs.map(blog => blog.id !== changedBlog.id ? blog : returnedBlog))

        setMessage(
          { ...message, messageType: 'success', messageText: `Updated ${b.title} likes` }
        )
        setTimeout(() => {
          setMessage({ ...message, messageType: 'error', messageText: null })
        }, 5000)
      })

      .catch(error => {
        setMessage({ ...message, messageType: 'success', messageText: `Failed to like ${b.title}, ${error}` })
        setTimeout(() => {
          setMessage({ ...message, messageType: 'error', messageText: null })
        }, 5000)
        setBlogs(blogs.filter(person => person.id !== changedBlog.id))
      })
  }

  const removeBlog = blogToDelete => {
    if (window.confirm(`Delete ${blogToDelete.title}?`)) {
      blogService
        .remove(blogToDelete.id)
        .then(
          setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id)),

          setMessage({ ...message, messageType: 'success', messageText: `Removed blog ${blogToDelete.title}` }),

          setTimeout(() => {
            setMessage({ ...message, messageType: 'error', messageText: null })
          }, 5000)
        )
        //eslint-disable-next-line no-unused-vars
        .catch(error => {
          setMessage({ ...message, messageType: 'error', messageText: `Removed blog ${blogToDelete.title}` })
          setTimeout(() => {
            setMessage({ ...message, messageType: 'error', messageText: null })
          }, 5000)
          setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id))
        })
    }
  }

  /*const blogForm = () => (
    <form onSubmit={addBlog}>
      <input
        value={newBlog}
        onChange={handleBlogChange}
      />
      <button type="submit">save</button>
    </form>
  )*/

  return (
    <div>
      <h2>blogs</h2>
      <Notification type={message.messageType} message={message.messageText}/>
      {user===null && <LoginForm
        handleLogin={handleLogin}
        password={password}
        username={username}
        setPassword={setPassword}
        setUsername={setUsername}
      />
      }
      {user && <div>
        <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      </div>
      }
      {user &&
        <Togglable buttonLabel="new blog">
          {<BlogForm createBlog={addBlog}/>}
        </Togglable>
      }
      {/*blogs.map(blog => {
        //console.log(blog.user)
        if(user!==null && blog.user.username===user.username) {
          return <Blog key={blog.id} blog={blog} />
        }
        return null
      }
    )*/}
      <Blogs blogs={blogs} addLike={addLike} removeBlog={removeBlog} user={user} />
    </div>
  )
}

export default App