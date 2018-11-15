import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            countries: [],
            filter: ''
        }
    }

    componentDidMount() {
        console.log('mounted')
        axios
            .get('https://restcountries.eu/rest/v2/all')
            .then(response => {
                console.log('promise fulfilled')
                this.setState({ countries: response.data })
            })
    }

    handleFilterChange = (event) => {
        console.log('filter:', event.target.value)
        this.setState({ filter: event.target.value })
    }

    render() {
        return (
            <div>
                find countries: <input onChange={this.handleFilterChange} />
                <CountryNames countries={this.state.countries} filter={this.state.filter} />
            </div>
        )
    }
    
}

const CountryNames = ({ countries, filter }) => {
    const filteredCountries = countries.filter(country => country.name.toLowerCase().includes(filter.toLowerCase()))
    if(filteredCountries.length === 1) {
        const country = filteredCountries[0]
        return(
            <div>
                <Country name={country.name} capital={country.capital} population={country.population} flag={country.flag}/>
            </div>
        )
    } else if (filteredCountries.length > 10) {
        return (
            <div>
                <p>too many matches, specify another filter</p>
            </div>
        )
    } else {
        return (
            <div>
                {filteredCountries.map(country => <div key={country.name}> {country.name} </div>)}
            </div>
        )
    }
}

const Country = ({name, capital, population, flag}) => {
    return (
        <div>
            <h1>{name}</h1>
            <p>capital: {capital}</p>
            <p>population: {population} </p>
            <img width={300} height={200} src={flag} alt={name}/>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));