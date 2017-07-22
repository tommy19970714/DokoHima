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
      <table className="type07">
      <thead>
        {<tr><th scope="cols">room</th><th scope="cols">混雑状況</th><th scope="cols">追加情報</th></tr>}
      </thead>
      <tbody>
        {this.state.rows.map(row => <tr><th scope="row">{ row.room }</th><td scope="row">{ row.status }</td><td scope="row">{ row.detail }</td></tr>)}
      </tbody>
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
