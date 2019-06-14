import React from 'react';
import axios from 'axios';
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      val: '',
      price: '',
      product: ''
    }
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFireBase = this.handleFireBase.bind(this);
  }

  handleFireBase() {
    axios.get('https://us-central1-testpoject-ec4bf.cloudfunctions.net/helloWorld/test', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          'Content-Type': 'application/json',
          'crossorigin': true,
        }
      })
      .then((res) => {
        console.log('firebaseresponse ', res.data);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  handleSubmit(e) {
    e.preventDefault();
    const page = this.state.val;
    const data = {
      data: page
    };
    const config = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Content-Type': 'application/json',
        'crossorigin': true,
      }
    }
    console.log(this.state.val);
    axios.post('https://us-central1-testpoject-ec4bf.cloudfunctions.net/scraper/', data, config)
      .then((res) => {
        console.log(res.data);
        this.setState({
          price: res.data.price,
          product: res.data.product,
        })
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleInput(e) {
    const val = e.target.value;
    this.setState({
      val
    });
  }
  render() {
    const {
      val,
      product,
      price
    } = this.state;
    return (
      <div>
      <p>Hello</p>
      <form onSubmit={this.handleSubmit}>
        <input type='text' name='url' value={val} onChange={this.handleInput}/>
        <input type='submit' value='submit' />
      </form>
      <h2>data: </h2>
      <p>product: {product}</p>
      <p>price: {price}</p>
      <button onClick={this.handleFireBase}>Firebase Test</button>
      </div>
    )
  }
}

export default App;