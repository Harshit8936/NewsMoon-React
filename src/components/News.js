import React,{useEffect,useState} from 'react'
import Newsitem from './Newsitem'
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";


export default function News(props){
  const[articles, setArticles] = useState([])
  const[loading, setLoading] = useState(true)
  const[page, setPage] = useState(1)
  const[totalResults, settotalResults] = useState(0)
    

 const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
   
  const updateNews = async()=> {
    props.setProgress(0);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    let data = await fetch(url);
    let res = await data.json();
    setArticles(res.articles);
    settotalResults(res.totalResults);
    setLoading(false)
    props.setProgress(100);
  }
  useEffect(() =>{
    updateNews();
    document.title = `News Moon - ${capitalizeFirstLetter(props.category)}`
    // eslint-disable-next-line
  }, [])

  // const handleNextClick = async () => {
      //  setPage(page + 1)
  //   updateNews();

  // }
  // const handlePrevClick = async () => {
  //   setPage(page - 1)
  //   updateNews();
  // }
  const fetchMoreData = async () => {
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page + 1)
    let data = await fetch(url);
    let res = await data.json();
    setArticles(articles.concat(res.articles))
    settotalResults(res.totalResults)
  };

    return (
      <>
        <h2 className='text-center' style={{ margin: "35px 0px",marginTop: "90px" }}>NewsMoon - Top {capitalizeFirstLetter(props.category)} Headlines</h2>
        {loading && <Spinner />}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner />}>
          <div className="container">
            <div className="row">
              {articles && articles.map((element,index) => {
                return <div className="col-lg-3 col-md-4 mx-1" key={index}>
                  <Newsitem title={element.title ? element.title.slice(0, 45) : ""} description={element.description ? element.description.slice(0, 88) : ""} imageUrl={element.urlToImage ? element.urlToImage : ""} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} /></div>
              })}
            </div>
          </div>
        </InfiniteScroll>
        {/* <div className="container d-flex justify-content-between">
          <button disabled={page <= 1} type="button" className="btn btn-dark" onClick={handlePrevClick}>&laquo; Previous</button>
          <button disabled={page + 1 > Math.ceil(totalResults / props.pageSize)} type="button" className="btn btn-dark" onClick={handleNextClick}>Next &raquo;</button>
        </div> */}
      </>
    )
  }



News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string
}
News.defaultProps = {
  country: 'in',
  pageSize: 8,
  category: 'general'
}
