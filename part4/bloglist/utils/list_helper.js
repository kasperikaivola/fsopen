const lodash = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  if(blogs.length===0) return 0
  return blogs.reduce((a,b) => a+b.likes,0)
}

const favoriteBlog = (blogs) => {
  if(blogs.length===0) return null //no blogs->no favorite blog
  return blogs.reduce((a,b) => a.likes>b.likes ? a:b)
}

const mostBlogs = (blogs) => {
  if(blogs.length===0) return null //no blogs->no writer with most blogs
  const counted = lodash.countBy(blogs, (blog) => {
    return blog.author
  })
  //const counted2 = lodash.fromPairs(lodash.sortBy(lodash.toPairs(counted), 1).reverse())
  //var counted2 = { Object.keys(counted), Object.values(counted) }
  const counted2 = Object.keys(counted).reduce((acc, key, index) => {
    acc[key] = Object.values(counted)[index]
    return acc
  },{})
  //const counted3 = counted2.sort((a,b) => {return a.value-b.value})
  //return counted3
  /*const topAuthor = Array.from(counted2).reduce((a, b) => {
    return Object.values(a) > Object.values(b) ? a : b
  })*/

  /*return {
    author: Object.keys(topAuthor),
    blogs: Object.values(topAuthor),
  }*/
  const counted3 = Object.entries(counted2).sort(([,value],[,value2]) => {return value2-value})
  return {
    author: Object.values(counted3[0])[0],
    blogs: Object.values(counted3[0])[1],
  }
}

const mostLikes = (blogs) => {
  if(blogs.length===0) return null //no blogs->no writer with most likes
  const topAuthorAndLikes = lodash(blogs).groupBy((blog) => {
    return blog.author
  }) //group blogs by author->Array of objects (authors, name as key) with articles inside them
    .map((authorObj, key) => ({
      author: key, //the key of the object is the author name
      likes: lodash.sumBy(authorObj, (article) => {
        //sum likes from all articles of a single author
        return article.likes
      }),
    })) //now we have an array of authors with their total likes
    .reduce((auth1, auth2) => { //reduce the array to find who has the most total likes
      return auth1.likes >= auth2.likes ? auth1 : auth2
    })
  /*const grouped2 = Object.keys(grouped).reduce((acc, key, index) => {
    acc[key] = Object.values(grouped)[index]
    return acc
  },{})
  const grouped3=Object.entries(grouped2).map((objs, key) => ({
    author: key,
    likes: lodash.sumBy(objs, 'likes'),
  }))*/
  return topAuthorAndLikes
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}