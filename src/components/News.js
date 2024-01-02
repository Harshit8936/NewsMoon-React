import React, { Component } from 'react'
import Newsitem from './Newsitem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'


export class News extends Component {
  static defaultProps = {
    country:'in',
    pageSize:8,
    category:'general'
  }
  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
  }

  constructor() {
    // console.log("calling from constructor")
    super();
    this.state = { articles: [], loading: false, page: 1 }

  }
  async componentDidMount() {
    // console.log("componnet did amount")
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=9c6296d231384c09ad6456ea27fd9f50&page=1&pageSize=${this.props.pageSize}`;
    this.setState({loading:true})
    let data = await fetch(url);
    let res = await data.json();
    this.setState({ articles: res.articles, totalResults: res.totalResults, loading:false })
  }

  handleNextClick = async () => {
    // console.log("Next")
    if (!(this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize))) {
      let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=9c6296d231384c09ad6456ea27fd9f50&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
      this.setState({loading:true})
      let data = await fetch(url);
      let res = await data.json();
      this.setState({
        page: this.state.page + 1,
        articles: res.articles,
        loading:false
      })
    }

  }
  handlePrevClick = async () => {
    // console.log("Previous")
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=9c6296d231384c09ad6456ea27fd9f50&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
    this.setState({loading:true})
    let data = await fetch(url);
    let res = await data.json();
    this.setState({
      page: this.state.page - 1,
      articles: res.articles,
      loading:false
    })

  }


  render() {
    // console.log("render")
    return (
      <div className='container my-3'>
        <h2 className='text-center' style={{margin:"35px 0px"}}>NewsMoon - Top Headlines</h2>
        {this.state.loading && <Spinner />}
        <div className="row">
          {!this.state.loading &&this.state.articles && this.state.articles.map((element) => {
            return <div className="col-lg-3 col-md-4 mx-3" key={element.url}>
              <Newsitem title={element.title ? element.title.slice(0, 45) : ""} description={element.description ? element.description.slice(0, 88) : ""} imageUrl={element.urlToImage ? element.urlToImage : ""} newsUrl={element.url} /></div>
          })}
        </div>
        <div className="container d-flex justify-content-between">
          <button disabled={this.state.page <= 1} type="button" className="btn btn-dark" onClick={this.handlePrevClick}>&laquo; Previous</button>
          <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &raquo;</button>
        </div>
      </div>
    )
  }
}

export default News
