import React from 'react';
import PropTypes from 'prop-types';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadBlockList } from '../../../actions/block';
import { getBlockListByName } from '../../../reducers/block';

// components
import HTMLText from '../../html-text';

// style
import CSSModules from 'react-css-modules';
import styles from './style.scss';

@connect(
  (state, props) => ({
    list: getBlockListByName(state, props.id)
  }),
  dispatch => ({
    loadList: bindActionCreators(loadBlockList, dispatch)
  })
)
@CSSModules(styles)
export class BlockList extends React.Component {

  static defaultProps = {
    // 滚动底部加载更多
    scrollLoad: false
  }

  static propTypes = {
    // 列表id
    id: PropTypes.string.isRequired,
    // 列表的筛选条件
    filters: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { list, id, scrollLoad } = this.props;
    if (!list.data) this.loadDate();
    if (scrollLoad) ArriveFooter.add(id, this.loadDate);
  }

  componentWillUnmount() {
    const { id, scrollLoad } = this.props;
    if (scrollLoad) ArriveFooter.remove(id);
  }

  componentWillReceiveProps(props) {
    if (props.id != this.props.id) {
      this.componentWillUnmount();
      this.props = props;
      this.componentDidMount();
    }
  }

  async loadDate(restart = false) {
    const { id, filters, loadList } = this.props;
    let _filters = JSON.parse(JSON.stringify(filters));
    await loadList({ id, args: _filters, restart });
  }

  render() {

    const { data = [], loading, more, count } = this.props.list;

    return(<div className="list-group">
      {data.map(item=>{
        return (<div key={item._id} className="list-group-item">

          <a href="javascript:void(0)" styleName="cancel" className="btn btn-outline-secondary btn-sm">取消</a>

          {item.posts_id ?
            item.posts_id.title
            : null}

          {item.people_id ?
            <div styleName="people">
              <img src={item.people_id.avatar} />
              {item.people_id.nickname}
            </div>
            : null}

          {item.comment_id ?
            <HTMLText content={item.comment_id.content_html} />
            : null}

        </div>)
      })}
    </div>)
  }

}

export default BlockList;