import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createGroup } from '../actions'


class CreateGroup extends Component {
  state = {
    formdata: {
      group_id: '',
      product_name: '',
      min_amt: '',
      discount_amt: '',
      orig_price: '',
      members: '',
      description: '',
      discount_perc: '',
    }

  }

  handleInput = (event, name) => {
    const newFormData = {
      ...this.state.formdata
    }
    newFormData[name] = event.target.value;
    this.setState({
      formdata: newFormData
    })

  }

  submitForm = (e) => {
    e.preventDefault();
    // console.log(this.state.formdata);
    console.log('new formdata = ', {...this.state.formdata});
    this.props.dispatch(createGroup({
      ...this.state.formdata, // spreading everything in 'formdata' to this new object

    }))

  }

  render() {
    console.log('this.props = ', this.props)
    return (
      <div className="group_container">
        add_group
        <form onSubmit={this.submitForm}>
          <h2>Create a Group</h2>
          <div className="form_element">
            <input 
              type="text"
              placeholder="Enter product name"
              value={this.state.formdata.product_name}
              onChange={(event) => this.handleInput(event, 'product_name')}
            />
          </div>
          <div className="form_element">
            <input 
              type="text"
              placeholder="Enter minimum amount"
              value={this.state.formdata.min_amt}
              onChange={(event) => this.handleInput(event, 'min_amt')}

            />
          </div>
          <div className="form_element">
            <input 
              type="text"
              placeholder="Enter discount amount"
              value={this.state.formdata.discount_amt}
              onChange={(event) => this.handleInput(event, 'discount_amt')}

            />
          </div>
          <div className="form_element">
            <select 
              value={this.state.formdata.discount_perc}
              onChange={(event) => this.handleInput(event, 'discount_perc')}
            >
              <option val="10">0 - 10 %</option>
              <option val="20">11 - 20 %</option>
              <option val="30">21 - 30 %</option>
              <option val="40">31 - 40 %</option>
              <option val="50">41 - 50 %</option>
              <option val="60">51 - 60 %</option>
              <option val="70">61 - 70 %</option>
              <option val="80+"> 70 % +</option>
            </select>
          </div>
          <textarea 
            value={this.state.formdata.description}
            onChange={(event) => this.handleInput(event, 'description')}

          />

          <button type="submit">Create group</button>

        </form>
      </div>
    )
  }


}

function mapStateToProps(state) {
  return {
    groups: state.groups
  }
}

// export default CreateGroup;
export default connect(mapStateToProps)(CreateGroup)