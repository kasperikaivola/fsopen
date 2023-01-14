const listHelper = require('../utils/list_helper')
const { emptyList,blog,blogs } = require('./testBlogs')

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total amount of likes', () => {
  test('empty list, so 0 likes', () => {
    expect(listHelper.totalLikes(emptyList)).toBe(0)
  })
  test('1 blog with 88 likes', () => {
    expect(listHelper.totalLikes(blog)).toBe(88)
  })
  test('6 blogs, total 308 likes', () => {
    expect(listHelper.totalLikes(blogs)).toBe(36)
  })
})

describe('favorite blog', () => {
  test('empty list, so favorite blog is null', () => {
    expect(listHelper.favoriteBlog(emptyList)).toBe(null)
  })
  test('1 blog, so must be the favorite', () => {
    expect(listHelper.favoriteBlog(blog)).toBe(blog[0])
  })
  test('6 blogs, favorite should be Canonical string reduction', () => {
    expect(listHelper.favoriteBlog(blogs)).toBe(blogs[5])
  })
})

describe('most blogs', () => {
  test('empty list, so author with most blogs is null', () => {
    expect(listHelper.mostBlogs(emptyList)).toBe(null)
  })
  test('1 blog, so author with most blogs must be that blogs author', () => {
    expect(listHelper.mostBlogs(blog)).toStrictEqual({ author: 'coolauthor3', blogs: 1 })
  })
  test('6 blogs, author with most blogs (3) should be Robert C. Martin', () => {
    expect(listHelper.mostBlogs(blogs)).toStrictEqual({ author: 'Robert C. Martin', blogs: 3 })
  })
})