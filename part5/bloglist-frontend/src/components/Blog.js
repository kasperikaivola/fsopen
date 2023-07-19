import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = (props) => {
  const blogStyle = {
    paddingTop: 0,
    paddingLeft: 0,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 0
  }

  const [view, setView] = useState(false)

  const hideWhenVisible = { display: view ? 'none' : '' }
  const showWhenVisible = { display: view ? '' : 'none' }

  const handleView = () => {
    setView(!view)
  }

  return (
    <div style={blogStyle} >
      <ul>
        <div style={hideWhenVisible} className='blogtitle'>
          <h4>{props.title} <button onClick={handleView}>view</button></h4>
        </div>
        <div style={showWhenVisible} className='blogdetails'>
          <h4>{props.title} <button onClick={handleView}>hide</button></h4>
          <li>Author: {props.author}</li>
          <li>Url: {props.url}</li>
          <li>Likes: {props.likes} <LikeButton handleClick={props.addLike}/></li>
          <li>Added by: {props.user}</li>
          <DeleteButton handleDelete={props.removeBlog} owner={props.validateOwner} />
        </div>
      </ul>
    </div>
  )
}

const LikeButton = ({ handleClick }) => {
  return (
    <>
      <button onClick={handleClick}>
        like
      </button>
    </>
  )
}

const DeleteButton = ({ handleDelete, owner }) => {
  if (owner) {
    return (
      <>
        <button onClick={handleDelete}>
          delete
        </button>
      </>
    )
  } else {
    return (
      <>
      </>
    )
  }
}

LikeButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
}

DeleteButton.propTypes = {
  handleDelete: PropTypes.func.isRequired,
  owner: PropTypes.bool.isRequired
}

export default Blog