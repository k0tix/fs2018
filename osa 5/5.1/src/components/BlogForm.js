import React from 'react'
import {Button, Input, Form} from 'semantic-ui-react'

const BlogForm = ({onSubmit, handleChange, title, author, url}) => {
    return (
        <div>
          <h2>create new blog</h2>
  
          <Form onSubmit={onSubmit}>
          <Form.Field>
              <label>title</label>
              <Input
                type="text"
                name="title"
                value={title}
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field>
              <label>author</label>
              <Input
                type="text"
                name="author"
                value={author}
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field>
              <label>url</label>
              <Input
                type="text"
                name="url"
                value={url}
                onChange={handleChange}
              />
            </Form.Field>
            <Button primary type="submit">create</Button>
          </Form>
        </div>
    )
  }

  export default BlogForm