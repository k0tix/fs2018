import React from 'react'
import { mount } from 'enzyme'
import App from './App'
import Blog from './components/Blog'
jest.mock('./services/blogs')


describe('<App />', () => {
    let app

    describe('when user is not logged in', () => {
        beforeEach(() => {
            app = mount(<App />)
        })

        it('renders only login form ', () => {
            app.update()
            const blogComponent = app.find('Blog')
            expect(blogComponent.length).toBe(0)
            const loginComponent = app.find('.loginForm')
            expect(loginComponent.text()).toContain('username')
        })
    })

    describe('when user is logged in', () => {
        beforeEach(() => {
            const user = {
                username: 'tester',
                token: 'asdasdasd',
                name: 'Tester man'
            }

            localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
            app = mount(<App />)
        })

        it('renders blogs if a user is logged in', () => {
            app.update()

            const blogComponent = app.find('Blog')

            expect(app.text()).toContain('likes')
            expect(app.text()).toContain('Pekka Pekkanen')
            expect(blogComponent.length).not.toBe(0)
        })
    })




})

