class MessageTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = { messages: [] }
    socket.on('message', (newmessage) => {
      this.setState({messages: newmessage.concat(this.state.messages)})
    })
  }
  componentDidMount() {
   this.getMessage()
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
        {this.state.messages.map(function(message, i) {
          return (
            <li key={i}>{ message.message }</li>
          )
         }, this)}
      </div>
    )
  }
}

ReactDOM.render(
  <MessageTable />,
  document.getElementById('message-content')
);
