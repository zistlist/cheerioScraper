import React from 'react';
import axios from 'axios';
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      val: '',
      price: '',
      product: '',
      description: [],
      image: '',
      id: '',
      onSale: '',
    }
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFireBase = this.handleFireBase.bind(this);
  }

  handleFireBase() {
    console.log('sending post', {
      data: 'https://www.amazon.com/Amazon-Essentials-Mens-Slim-Fit-Stretch/dp/B07BJL3JRW/ref=sr_1_2_sspa?keywords=jeans&qid=1561084472&s=gateway&sr=8-2-spons&psc=1'
    });
    axios.post('https://us-central1-myproject-dbb0e.cloudfunctions.net/scraper', {
        data: 'https://www.amazon.com/Amazon-Essentials-Mens-Slim-Fit-Stretch/dp/B07BJL3JRW/ref=sr_1_2_sspa?keywords=jeans&qid=1561084472&s=gateway&sr=8-2-spons&psc=1'
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

    console.log('sending: ', this.state.val);
    axios.post('/', {
        data: this.state.val
      })
      .then((res) => {
        console.log(res.data);
        this.setState({
          price: res.data.price,
          product: res.data.name,
          description: res.data.description,
          image: res.data.imageUrl,
          val: '',
          id: res.data.id,
          onSale: res.data.onSale,
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
      price,
      description,
      image,
      id,
      onSale,
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
      <img src={image} alt='product'></img>
      <p>imgUrl: {image} </p>
      <p>price: {price}</p>
      <p>id: {id}</p>
      <p>onSale: {onSale} </p>
      <ul>{description.map((item) => {
          return <li>{item}</li>
        })}</ul>
      <button onClick={this.handleFireBase}>Firebase Test</button>
      </div>
    )
  }
}

export default App;