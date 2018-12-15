import React from 'react'
import {shallow} from 'enzyme'
import SimpleBlog from './SimpleBlog'

describe('SimpleBlog ', () => {
      const blog = {
            title: 'test title',
            author: 'test author',
            likes: 23
      }
      it('renders content', () => {
            const blogComponent = shallow(<SimpleBlog blog={blog} onClick={() => {}} />)
            const infoDiv = blogComponent.find('.info')
            const likesDiv = blogComponent.find('.likes')

            expect(infoDiv.text()).toContain(`${blog.title} ${blog.author}`)
            expect(likesDiv.text()).toContain(blog.likes)
      })

      it('button registers clicks', () => {
            const mockHandler = jest.fn()

            const blogComponent = shallow(<SimpleBlog blog={blog} onClick={mockHandler} />)

            const button = blogComponent.find('button')
            button.simulate('click')
            button.simulate('click')

            expect(mockHandler.mock.calls.length).toBe(2)
      })
})