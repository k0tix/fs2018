import React from 'react'
import { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Blog from './Blog'

describe('<Blog />', () => {
      const blog = {
            title: 'test title',
            author: 'test author',
            url: 'test url',
            likes: 232,
            user: {
                  _id: '5b7b1b8eec360e0986953f67',
                  username: 'koti',
                  name: 'Pekka Pekkanen'
            },
      }

      it('after clicking title the details are displayed', () => {
            const togglableBlog = shallow(<Blog blog={blog}/>)
            togglableBlog.simulate('click')

            const titleDiv = togglableBlog.find('.title')
            expect(titleDiv.text()).toContain(`${blog.title} ${blog.author}`)

            const infoDiv = togglableBlog.find('.info')
            expect(infoDiv.text()).toContain(blog.url)
            expect(infoDiv.text()).toContain(blog.likes)
      })

})


  
  