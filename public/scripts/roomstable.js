class RoomsTable extends React.Component {
 constructor(props) {
  super(props)
  this.state = { rows: [], messages: [] }
  socket.on('room', (payload) => {
      setTimeout(() => {
        this.handleInterval()
      }, 500)
    })
  socket.on('message', (newmessage) => {
      this.setState({messages: newmessage.concat(this.state.messages)})
    })
 }
 componentDidMount() {
   this.handleInterval()
   this.getMessage()
 }
 handleInterval() {
  fetch('/api/roomdata')
   .then(response => response.json())
   .then(json => {
    this.setState({ rows: json })
   })
 }
 getMessage() {
  fetch('/api/messagesData')
   .then(response => response.json())
   .then(json => {
    this.setState({ messages: json })
   })
 }
 render() {
  return (
    <div>
      <table className="regularTable">
      {<tr><td>room</td><td>status</td><td>detail</td></tr>}
      {this.state.rows.map(row => <tr><td>{ row.room }</td><td>{ row.status }</td><td>{ row.detail }</td></tr>)}
      </table>
      <table className="messageTable">
      {this.state.messages.map(message => <tr>{ message.message }</tr>)}
      </table>
    </div>
  )
 }
}

ReactDOM.render(
  <RoomsTable />,
  document.getElementById('content')
);
