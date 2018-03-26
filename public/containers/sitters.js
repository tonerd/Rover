import { connect } from 'react-redux'
import { getList } from '../actions/sitters'
import Sitters from '../components/sitters/sitters'

const mapStateToProps = state => {
  return {
    list: state.sitters.list,
    pageSize: state.sitters.pageSize,
    serviceError: state.sitters.serviceError,
    totalItems: state.sitters.totalItems
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getList: (start, size, minRating) => dispatch(getList(start, size, minRating))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sitters);
