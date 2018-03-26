import React, {Component} from 'react';
import Pagination from '../common/pagination';
import SittersRow from './sitters_row';

class Sitters extends Component {
  constructor() {
    super();

    this.state = {
      minRating: 1
    }

    this.onMinRatingChange = this.onMinRatingChange.bind(this);
    this.paginationChange = this.paginationChange.bind(this);
  }

  componentDidMount() {
    this.props.getList(0, this.props.pageSize, this.state.minRating);
  }

  onMinRatingChange(event) {
    this.setState({ minRating: event.target.value }, () => {
      this.props.getList(0, this.props.pageSize, this.state.minRating);
    });
  }

  paginationChange(start, end) {
    window.scrollTo(0, 0);
    this.props.getList(start, this.props.pageSize, this.state.minRating);
  }

  render() {
    return (
      <div id='sitters'>
        <div className='container'>
          <div className='row'>
            <h1 className='col-sm-12'>Sitters</h1>
          </div>
          {
            this.props.serviceError &&
              <div className='row'>
                <div className='col-sm-12'>
                  <div className='alert alert-danger'>There was a problem with the sitter listings service, please try again.</div>
                </div>
              </div>
          }
          {
            this.props.list && this.props.list.length === 0 &&
            <div className='row'>
              <div className='col-sm-12'>
                <div className='alert alert-info'>There were no results for your search, please try again.</div>
              </div>
            </div>
          }
          {
            this.props.list &&
              <div>
                <div className='row'>
                  <div className='col-sm-12 sitterFilters'>
                    <div className='col-sm-12'>
                      <label htmlFor='minRatingSlider'>min rating ({this.state.minRating})</label>
                      <input id='minRatingSlider' type='range' min='1' max='4' value={this.state.minRating} onChange={this.onMinRatingChange}/>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-sm-12'>
                    <table className='table'>
                      <tbody>
                      {
                        this.props.list.map((item, index) => (
                          <tr key={'sitter' + index} >
                            <td className='col-sm-12'>
                              <SittersRow sitter={item} />
                            </td>
                          </tr>
                        ))
                      }
                      <tr>
                        <td className='col-sm-12'>
                        {
                          <Pagination totalItems={this.props.totalItems} pageSize={this.props.pageSize} onChange={this.paginationChange} />
                        }
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              </div>
          }
        </div>
      </div>
    );
  }
}

export default Sitters
