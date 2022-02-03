function App() {
  const [username, setUsername] = React.useState("");

  // Only show navbar if user is logged in
  const navbar = username ? <Navbar setUsername={setUsername}/> : ""
  return (
    <ReactRouterDOM.BrowserRouter>
      {navbar}
      <div className="container-fluid">
        <ReactRouterDOM.Route exact path="/">
          <Login setUsername={setUsername} />
        </ReactRouterDOM.Route>
        <ReactRouterDOM.Route exact path="/schedule">
          <AvailableReservations username={username} />
        </ReactRouterDOM.Route>
        <ReactRouterDOM.Route exact path="/reservations">
          <CurrentReservations username={username} />
        </ReactRouterDOM.Route>
      </div>
    </ReactRouterDOM.BrowserRouter>
  );
}

ReactDOM.render(<App />, document.querySelector('#root'));
