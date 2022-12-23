const Notification = ({type,message, messageState}) => {
    if (message === null) {
      return null
    }
    else if(type==='success') {
        return (
          <div className='success'>
            {message}
          </div>
        )
    }
    else {
        return (
          <div className='error'>
            {message}
          </div>
        )
  }
}

export default Notification