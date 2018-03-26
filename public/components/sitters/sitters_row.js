import React, {Component} from 'react';

class SittersRow extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className='row sitterRow'>
        <div className='col-sm-4'>
          <img src={this.props.sitter.image} />
        </div>
        <div className='col-sm-4 sitterName'>{this.props.sitter.name}</div>
        <div className='col-sm-4 sitterRating'>{this.props.sitter.rating.toFixed(1)}</div>
      </div>
    );
  }
}

export default SittersRow
