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
    }
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFireBase = this.handleFireBase.bind(this);
  }

  handleFireBase() {
    console.log('sending post', {
      data: 'https://www.amazon.com/Ferro-Aldo-MFA806035-Mid-Top-Lace-Up/dp/B01NCWLJ8G?pf_rd_p=3ebd7bb8-e4db-4762-b094-2aa45768a3b5&pd_rd_wg=v87VZ&pf_rd_r=BVJ1BJK6RHWZTT2AAH79&ref_=pd_gw_cr_cartx&pd_rd_w=DE9qE&pd_rd_r=37fce3d5-d3ea-4d67-b2fd-c46f87610b02'
    });
    axios.post('https://us-central1-myproject-dbb0e.cloudfunctions.net/scraper', {
        data: 'https://www.amazon.com/Ferro-Aldo-MFA806035-Mid-Top-Lace-Up/dp/B01NCWLJ8G?pf_rd_p=3ebd7bb8-e4db-4762-b094-2aa45768a3b5&pd_rd_wg=v87VZ&pf_rd_r=BVJ1BJK6RHWZTT2AAH79&ref_=pd_gw_cr_cartx&pd_rd_w=DE9qE&pd_rd_r=37fce3d5-d3ea-4d67-b2fd-c46f87610b02'
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
    axios.post('https://us-central1-myproject-dbb0e.cloudfunctions.net/scraper', {
        data: 'https://www.amazon.com/BLUBOON-Vintage-Backpack-Leather-Rucksack/dp/B019NZHMQW?pf_rd_p=3ebd7bb8-e4db-4762-b094-2aa45768a3b5&pd_rd_wg=V4BMS&pf_rd_r=J94E746D6XDKKW70QVHQ&ref_=pd_gw_cr_cartx&pd_rd_w=2zLvw&pd_rd_r=815dbb47-13d6-4c43-8a0b-fbbdd28a5ad7'
      })
      .then((res) => {
        console.log(res.data);
        this.setState({
          price: res.data.price,
          product: res.data.item_name,
          description: res.data.description,
          image: res.data.photo
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
      <p>price: {price}</p>
      <ul>{description.map((item) => {
          return <li>{item}</li>
        })}</ul>
      <button onClick={this.handleFireBase}>Firebase Test</button>
      </div>
    )
  }
}

export default App;