import React from 'react'
import ReactDOM from 'react-dom'
import personService from './services/persons'
import './index.css'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            persons: [],
            newName: '',
            newNumber: '',
            filter: '',
            notification: null
        }
    }

    componentDidMount() {
        console.log('mounted')
        personService.getAll().then(response => {
            this.setState({ persons: response })
        })
    }

    addContact = (event) => {
        event.preventDefault()
        const person = {
            name: this.state.newName,
            number: this.state.newNumber
        }

        if (this.state.persons.filter(p => p.name === person.name).length > 0) {
            if (window.confirm(`${person.name} on jo luettelossa, korvataanko vanha numero uudella?`)) {
                const id = this.state.persons.filter(p => p.name === person.name)[0].id

                personService.update(id, person).then(persons => {
                    personService.getAll().then(persons => {
                        this.setState({
                            persons,
                            newName: '',
                            newNumber: '',
                            notification: `henkilön "${person.name}" numeroa muutettiin`
                        })
                            ,setTimeout(() => {
                                this.setState({notification: null})
                            }, 2500)
                    })
                })
                .catch(error => {
                    personService.create(person)
                    .then(response => {personService.getAll().then(response => this.setState({
                        persons: response,
                        newName: '',
                        newNumber: ''
                    }))    
                })})
            }
        } else {
            personService.create(person)
                .then(response => this.setState({
                    persons: this.state.persons.concat(response),
                    newName: '',
                    newNumber: '',
                    notification: ` ${person.name} lisättiin`
                })
                    , setTimeout(() => {
                        this.setState({ notification: null })
                    }, 2500)
                )
        }
    }

    removeContact = (id) => {
        return () => {
            const person = this.state.persons.filter(p => p.id === id)[0]
            if (window.confirm(`poistetaanko ${person.name}`)) {
                personService.remove(id).then(response => {
                    this.setState({
                        persons: this.state.persons.filter(p => p.id !== id),
                        notification: `${person.name} poistettiin`
                    })
                        , setTimeout(() => {
                            this.setState({notification:null})
                        }, 2500)
                })
            }
        }
    }

    handleNameChange = (event) => {
        console.log('name: ', event.target.value)
        this.setState({ newName: event.target.value })
    }

    handleNumberChange = (event) => {
        console.log('number: ', event.target.value)
        this.setState({ newNumber: event.target.value })
    }

    handleFilterChange = (event) => {
        console.log('filter: ', event.target.value)
        this.setState({ filter: event.target.value })
    }

    render() {
        const personsToShow = this.state.persons.filter(person => person.name.toLowerCase().includes(this.state.filter.toLowerCase()))

        return (
            <div>
                <h2>Puhelinluettelo</h2>
                <Filter onChange={this.handleFilterChange} value={this.state.filter} text={"rajaa näytettäviä: "} />

                <Notification message={this.state.notification} />

                <h2>Lisää uusi</h2>

                <form onSubmit={this.addContact}>
                    <div>
                        nimi: <input onChange={this.handleNameChange} value={this.state.newName} />
                    </div>
                    <div>
                        numero: <input onChange={this.handleNumberChange} value={this.state.newNumber} />
                    </div>
                    <div>
                        <button type="submit">lisää</button>
                    </div>
                </form>
                <h2>Numerot</h2>
                <ul>
                    {personsToShow.map(person => <Contact name={person.name} number={person.number} key={`${person.name}/${person.number}`} remove={this.removeContact(person.id)} />)}
                </ul>
            </div>
        )
    }
}

const Contact = ({ name, number, remove }) => {
    return (
        <li>
            <p>{name} {number} <button onClick={remove}>poista</button> </p>
        </li>
    )
}

const Filter = ({ onChange, filter, text }) => {
    return (
        <div>
            {text} <input onChange={onChange} value={filter} />
        </div>
    )
}

const Notification = ({ message }) => {
    if (message === null) {
        return null
    }

    return (
        <div className="notification">
            {message}
        </div>
    )
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
)
