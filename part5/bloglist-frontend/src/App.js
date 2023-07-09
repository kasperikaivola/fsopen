import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  //const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState({messageType: '', messageText: null})

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
      setMessage({...message, messageType: 'success', messageText: `Login successful`})
      setTimeout(() => {
        setMessage({...message, messageType: 'error', messageText: null})
      }, 5000)
    } catch (exception) {
      setMessage({...message, messageType: 'error', messageText: `Wrong credentials`})
      setTimeout(() => {
        setMessage({...message, messageType: 'error', messageText: null})
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = (blog) => {
    blogService
      .create(blog)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))

        setMessage({...message, messageType: 'success', messageText: `Added blog ${blog.title}`})
        setTimeout(() => {
          setMessage({...message, messageType: 'error', messageText: null})
        }, 5000)
      })
      // eslint-disable-next-line no-unused-vars
      .catch(error => {
        setMessage({...message, messageType: 'error', messageText: `Failed to add blog, check fields`})
        setTimeout(() => {
          setMessage({...message, messageType: 'error', messageText: null})
        }, 5000)
        setBlogs(blogs.filter(b => b.id !== blog.id))
      })
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
      {user!==null && <BlogForm createBlog={addBlog}/>}
      {blogs.map(blog => {
        //console.log(blog.user)
        if(user!==null && blog.user.username===user.username) {
          return <Blog key={blog.id} blog={blog} />
        }
        return null
      }
      )}
    </div>
  )
}

export default App