class RoomsTable extends React.Component {
 constructor(props) {
  super(props)
  this.state = { rows: [], messages: [] }
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
    <div>
      <table className="type07">
      <thead>
        {<tr><th scope="cols">room</th><th scope="cols">混雑状況</th><th scope="cols">追加情報</th></tr>}
      </thead>
      <tbody>
        {this.state.rows.map(function(row, i) {
        return (
          <tr key={i}><th scope="row">{ row.room }</th>
          <td scope="row">{ row.status }</td>
          <td scope="row">{ row.detail }</td></tr>
        )
        }, this)}
      </tbody>
      </table>
    </div>
  )
 }
}

ReactDOM.render(
  <RoomsTable />,
  document.getElementById('room-content')
);
