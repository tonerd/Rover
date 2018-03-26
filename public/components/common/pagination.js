import React, {Component} from 'react';

class Pagination extends Component {
  constructor(props) {
    super();

    this.state = {
      pageNumber: 1
    };
  }

  changePage(event, pageNumber) {
    event.preventDefault();
    let start = (pageNumber - 1) * this.props.pageSize;
    this.setState({ pageNumber: pageNumber }, () => {
      this.getPagingLinks();
    });

    if(this.props.onChange) {
      this.props.onChange(start, start + this.props.pageSize);
    }
  }

  componentDidMount() {
    this.getPagingLinks();
  }

  componentWillReceiveProps(nextProps, nextState) {
    if(this.props.totalItems !== nextProps.totalItems) {
      this.setState({ pageNumber: 1 }, () => {
        this.getPagingLinks();
      });
    }
  }

  getPagingLinks() {
    let currentPage = this.state.pageNumber;
    let pagingLinks = [];

    if(this.props.totalItems > this.props.pageSize) {
      let limit = this.props.totalItems % this.props.pageSize === 0 ? 0 : 1;
      limit += Math.floor(this.props.totalItems / this.props.pageSize);
      let keyIndex = 1;

      //previous
      if(currentPage > 1) {
        pagingLinks.push(<a href='#' key={'paging' + keyIndex} className='btn btn-primary btn-sm pagingPrevious' onClick={(e) => this.changePage(e, currentPage - 1)}>Previous</a>);
      }
      else {
        pagingLinks.push(<span key={'paging' + keyIndex} className='pagingPrevious'>Previous</span>);
      }
      keyIndex++;

      //page 1
      if(currentPage === 1) {
        pagingLinks.push(<span key={'paging' + keyIndex} className='pagingSelected'>1</span>);
      }
      else {
        pagingLinks.push(<a href='#' key={'paging' + keyIndex} onClick={(e) => this.changePage(e, 1)}>1</a>);
      }
      keyIndex++;

      //either draw ... or 2 through 4
      if(currentPage > 3 && limit > 4) {
        pagingLinks.push(<span key={'paging' + keyIndex}>...</span>);
        keyIndex++;
      }
      else {
        for (let i = 2; i < 5 && i < limit; i++) {
          if(i <= limit) {
            if(i === currentPage) {
              pagingLinks.push(<span key={'paging' + keyIndex} className='pagingSelected'>{i}</span>);
            }
            else {
              pagingLinks.push(<a href='#' key={'paging' + keyIndex} onClick={(e) => this.changePage(e, i)}>{i}</a>);
            }
            keyIndex++;
          }
        }

        if(limit > 4) {
          pagingLinks.push(<span key={'paging' + keyIndex}>...</span>);
          keyIndex++;
        }
      }

      //if current page is in middle
      if(currentPage > 3 && currentPage < limit - 3) {
        for (let i = currentPage - 1; i < currentPage + 2; i++) {
          if(i === currentPage) {
            pagingLinks.push(<span key={'paging' + keyIndex} className='pagingSelected'>{i}</span>);
          }
          else {
            pagingLinks.push(<a href='#' key={'paging' + keyIndex} onClick={(e) => this.changePage(e, i)}>{i}</a>);
          }
          keyIndex++;
        }

        pagingLinks.push(<span key={'paging' + keyIndex}>...</span>);
        keyIndex++;
      }

      //if current page is in last few pages
      if(currentPage > 3 && currentPage >= limit - 3 && limit > 4) {
        for (let i = limit - 3; i < limit; i++) {
          if(i === currentPage) {
            pagingLinks.push(<span key={'paging' + keyIndex} className='pagingSelected'>{i}</span>);
          }
          else {
            pagingLinks.push(<a href='#' key={'paging' + keyIndex} onClick={(e) => this.changePage(e, i)}>{i}</a>);
          }
          keyIndex++;
        }
      }

      //last page
      if(currentPage === limit) {
        pagingLinks.push(<span key={'paging' + keyIndex} className='pagingSelected'>{limit}</span>);
      }
      else {
        pagingLinks.push(<a href='#' key={'paging' + keyIndex} onClick={(e) => this.changePage(e, limit)}>{limit}</a>);
      }
      keyIndex++;

      //next
      if(currentPage < limit) {
        pagingLinks.push(<a href='#' key={'paging' + keyIndex} className='btn btn-primary btn-sm pagingNext' onClick={(e) => this.changePage(e, currentPage + 1)}>Next</a>);
      }
      else {
        pagingLinks.push(<span key={'paging' + keyIndex} className='pagingNext'>Next</span>);
      }
    }
    this.setState({ pagingLinks: pagingLinks });
  }

  render() {
    return <div className='paging'>{this.state.pagingLinks}</div>;
  }
}

export default Pagination
