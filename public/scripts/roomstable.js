class RoomsTable extends React.Component {
 constructor(props) {
  super(props)
  this.state = { rows: [] }
  socket.on('room', (payload) => {
      setTimeout(() => {
        this.handleInterval()
      }, 500)
    })
 }
 componentDidMount() {
   this.handleInterval()
 }
 handleInterval() {
  fetch('/api/roomdata')
   .then(response => response.json())
   .then(json => {
    this.setState({ rows: json })
   })
 }
 render() {
  return (
    <table className="regularTable">
    {<tr><td>room</td><td>status</td><td>detail</td></tr>}
    {this.state.rows.map(row => <tr><td>{ row.room }</td><td>{ row.status }</td><td>{ row.detail }</td></tr>)}
    </table>
  )
 }
}

ReactDOM.render(
  <RoomsTable />,
  document.getElementById('content')
);
