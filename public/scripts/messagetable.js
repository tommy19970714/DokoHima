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
                    <div key={i} className="media">
                      <div className="media-left">
                        <a href="#" className="icon-rounded">5J</a>
                      </div>
                      <div className="media-body">
                        <h4 className="media-heading">{ message.time }</h4>
                        <div>{ message.message }</div>
                      </div>
                    </div>
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
