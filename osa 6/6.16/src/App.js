import React from 'react'
import {BrowserRouter as Router, Route, NavLink, Link} from 'react-router-dom'
import {Container, Header, Table, Grid, Image, Menu, Segment, Button, Form, Card, Message} from 'semantic-ui-react'

const Menux = () => (
  <Menu inverted>
    <Menu.Item as={NavLink} exact to='/' >anecdotes</Menu.Item>
    <Menu.Item as={NavLink} exact to='/create' >create new</Menu.Item>
    <Menu.Item as={NavLink} exact to='/about' >about</Menu.Item>
  </Menu>
)

const AnecdoteList = ({ anecdotes }) => (
  <div style={{margin: '1em'}}>
    <Header as='h2' >Anecdotes</Header>

    <Table celled>
    {anecdotes.map(anecdote => 
      <Table.Row>
        <Table.Cell key={anecdote.id} ><Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link></Table.Cell>
      </Table.Row>)}
    </Table>
  </div>
)

const Anecdote = ({anecdote}) => (
  <div style={{margin: '1em'}}>  
    <h2>{anecdote.content}</h2>
    <p>has {anecdote.votes} votes</p>
    <p>for more info see <a href={anecdote.info}>{anecdote.info}</a></p>
  </div>
)

const About = () => (
  <Grid inverted columns='two' style={{margin: '1em'}}>
    <Grid.Row>
      <Grid.Column>
        <Header as='h2'>About anecdote app</Header>
        <p>According to Wikipedia:</p>
    
    <em>An anecdote is a brief, revealing account of an individual person or an incident. 
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself, 
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative. 
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
      </Grid.Column>
      <Grid.Column>
        <Card
          image='https://upload.wikimedia.org/wikipedia/commons/d/d9/Edsger_Wybe_Dijkstra.jpg' size='large'
          header='Edsger W. Dijkstra'
          meta='Born May 11, 1930'
        />
      </Grid.Column>
    </Grid.Row>
  </Grid>
)

const Footer = () => (
  <Segment vertical style={{ margin: '5em 5em' , padding: '1em'}}>
  <Message color='teal'>
    Anecdote app for <a href='https://courses.helsinki.fi/fi/TKT21009/121540749'>Full Stack -sovelluskehitys</a>.

      See <a href='https://github.com/mluukkai/routed-anecdotes'>https://github.com/mluukkai/routed-anecdotes</a> for the source code. 
  </Message>
  </Segment>

  
)

class CreateNew extends React.Component {
  constructor() {
    super()
    this.state = {
      content: '',
      author: '', 
      info: ''
    }
  }

  handleChange = (e) => {
    console.log(e.target.name, e.target.value)
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.addNew({
      content: this.state.content,
      author: this.state.author,
      info: this.state.info,
      votes: 0
    })

    this.props.history.push('/')
  }

  render() {
    return(
      <div style={{margin: '1em'}}>
        <Header as={'h2'}>create a new anecdote</Header>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Content</label>
            <input name='content' value={this.state.content} onChange={this.handleChange} />
          </Form.Field>
          <Form.Field>
            <label>Author</label>
            <input name='author' value={this.state.author} onChange={this.handleChange} />
          </Form.Field>
          <Form.Field>
            <label>Url for more info</label>
            <input name='info' value={this.state.info} onChange={this.handleChange} />
          </Form.Field>
          <Button primary>Create</Button>
        </Form>
      </div>  
    )

  }
}

const menuStyle = {
  backgroundColor: 'lightgrey',
  margin: '4px',
  padding: '6px'
}

const notificationStyle = {
  border: '2px solid lightgreen',
  borderRadius: '5px',
  fontSize: 16,
  padding: "5px",
  margin: "3px"
}

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      anecdotes: [
        {
          content: 'If it hurts, do it more often',
          author: 'Jez Humble',
          info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
          votes: 0,
          id: '1'
        },
        {
          content: 'Premature optimization is the root of all evil',
          author: 'Donald Knuth',
          info: 'http://wiki.c2.com/?PrematureOptimization',
          votes: 0,
          id: '2'
        }
      ],
      notification: ''
    } 
  }

  addNew = (anecdote) => {
    anecdote.id = (Math.random() * 10000).toFixed(0)
    this.setState({ anecdotes: this.state.anecdotes.concat(anecdote),
      notification: `a new anecdote ${anecdote.content} created!`  
    })
    setTimeout(() => {
      this.setState({notification: ''})
    }, 10000)
    
  }

  anecdoteById = (id) =>
    this.state.anecdotes.find(a => a.id === id)

  vote = (id) => {
    const anecdote = this.anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    const anecdotes = this.state.anecdotes.map(a => a.id === id ? voted : a)

    this.setState({ anecdotes })
  }

  render() {
    return(
      <Container>
          <Header as='h1' style={{margin: '1em'}}>Software anecdotes</Header>
          <Router>
            <div>
              <Menux/>
              {this.state.notification !== '' ? <Message info
                header='Update'
                content={this.state.notification}
              /> : null}

              <Route exact path='/' render={() => <AnecdoteList anecdotes={this.state.anecdotes}/>} />
              <Route path='/create' render={({history}) => <CreateNew history={history} addNew={this.addNew}/>}/>
              <Route path='/about' render={() => <About />}/>
              <Route exact path="/anecdotes/:id" render={({match}) =>
              <Anecdote anecdote={this.anecdoteById(match.params.id)}/>}
              />
            </div>
          </Router>
          <Footer />
        
      </Container>
    )


  }
}

export default App;
