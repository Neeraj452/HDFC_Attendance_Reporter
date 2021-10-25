import React, { Component } from 'react';
import { addApiData } from '../actions/AccountStatementAction'
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import { connect } from "react-redux";
import AccountNumbersUtils from "../utils/AccountNumbersUtils";
import { bindActionCreators } from "redux";
class Apiwordsearch extends Component {
      constructor(props) {
            super(props);
            this.state = {
                  word: "",
                  flag: false
            }
      }
      async getData() {
            const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${this.state.word}`)
            { response && this.addApiData(response) }
      }
      addApiData = async (response) => {
            this.getApi_Data()
            let object = {
                  id: this.props.accountStatement.apiworddata.length > 0 ? this.props.accountStatement.apiworddata[this.props.accountStatement.apiworddata.length - 1].id + 1 : 1,
                  word: this.state.word,
                  definition: response.data[0].meanings[0].definitions[0].definition,
                  example: response.data[0].meanings[0].definitions[0].example
            }
            this.props.accountStatement.apiworddata.forEach(element => {
                  if (element.word === this.state.word) {
                        this.setState({
                              flag: true
                        })
                  }
            });
            if (!this.state.flag) {
                  AccountNumbersUtils.addApiData(object)
                  let allPosts = await AccountNumbersUtils.getaddApiData()
                  this.props.addApiData(allPosts)
                  this.setState({
                        flag: false
                  })
            }
      }
      handelSubmit = () => {
            this.getData();
      }
      async getApi_Data() {
            let allPosts = await AccountNumbersUtils.getaddApiData()
            this.props.addApiData(allPosts)

      }
      componentDidMount() {
            this.getData();
            this.getApi_Data()

      }
      sortword = () => {
            this.props.accountStatement.apiworddata.sort((a, b) => {
                  let fa = a.word.toLowerCase(),
                        fb = b.word.toLowerCase();

                  if (fa < fb) {
                        return -1;
                  }
                  if (fa > fb) {
                        return 1;
                  }
                  return 0;
            })
      }
      render() {
            return (
                  <div className="container">
                        {this.sortword()}

                        <div className='text-center'>
                              <input type="text" value={this.state.word} onChange={(event) => this.setState({
                                    word: event.target.value
                              })}></input>
                              <button className="ml-3 btn btn-primary py-2" style={{ width: "80px" }} type="button" onClick={() => this.handelSubmit()} >submit</button>
                        </div>

                        {this.props.accountStatement.apiworddata.length > 0 &&
                              <div className="row">
                                    <div className="col-12 mx-auto">
                                          <h5 className="mb-3">
                                                <strong></strong>
                                          </h5>
                                          <table className="table  table-striped">
                                                <thead>
                                                      <tr className="">
                                                            <th className="col-sm-1">#</th>
                                                            <th className="col-sm-2">Word</th>
                                                            <th className="col-sm-5">Definition</th>
                                                            <th className="col-sm-4">Example</th>
                                                      </tr>
                                                </thead>
                                                <tbody>
                                                      {
                                                            this.props.accountStatement.apiworddata && (this.props.accountStatement.apiworddata).map((Element, index) => {
                                                                  const { word, definition, example } = Element
                                                                  return (
                                                                        <tr className={this.state.flag ? (word === this.state.word) ? "bg-danger" : null : null} >
                                                                              <td className="col-sm-1 py-4">{index + 1}</td>
                                                                              <td className="col-sm-2 py-4" >{word}</td>
                                                                              <td className="col-sm-5 py-4">{definition}</td>
                                                                              <td className="col-sm-4 py-4">{example}</td>
                                                                        </tr>
                                                                  )
                                                            })
                                                      }
                                                </tbody>
                                          </table>
                                    </div>
                              </div>
                        }

                        {this.state.flag && <Modal show={this.state.flag}>
                              <Modal.Header><h3>Error</h3>
                                    <button className="close" onClick={() => this.setState({ falg: false })} data-dismiss="modal" aria-label="Close">
                                          <span aria-hidden="true">&times;</span>
                                    </button>
                              </Modal.Header>
                              <Modal.Body>Word already present</Modal.Body>
                              <Modal.Footer>
                                    <Button onClick={() => this.setState({ flag: false })} style={{ width: "80px" }}>Ok</Button>
                              </Modal.Footer>
                        </Modal>
                        }
                  </div>
            )
      }
}

const mapStateToProps = state => ({
      accountStatement: state.accountStatementReducer
})

const mapDispatchToProps = (dispatch) =>
      bindActionCreators({
            addApiData
      }, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(Apiwordsearch);
