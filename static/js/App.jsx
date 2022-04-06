"use strict";

function App() {
  const [username, setUsername] = React.useState("");
  const [reservations, setReservations] = React.useState([]);

  // ReactRouterDOM hook that lets you route without reloading the page and losing parent state
  let history = ReactRouterDOM.useHistory();

  // Get reservations from DB when username changes
  React.useEffect(() => {
    fetch(`/get-current-reservations?username=${username}`)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setReservations(result);
      })
  }, [username]);

  function cancelReservation(res_id) {
    fetch(`/cancel-reservation/${res_id}`)
      .then(response => response.json())
      .then(newReservations => setReservations(newReservations))
  }

  function makeReservation(time) {
    fetch('/make-reservation', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({username: username, time: time})
    })
      .then(response => response.json())
      .then(newReservations => setReservations(newReservations))
    history.push("/reservations"); // Route to Current Reservations page
  }

  // Only show navbar if user is logged in
  if (username) {
    return (
      <React.Fragment>
        <Navbar setUsername={setUsername}/>
        <div className="container-fluid">
          <ReactRouterDOM.Route exact path="/">
            <Login setUsername={setUsername} />
          </ReactRouterDOM.Route>
          <ReactRouterDOM.Route exact path="/schedule">
            <AvailableReservations username={username} makeReservation={makeReservation}/>
          </ReactRouterDOM.Route>
          <ReactRouterDOM.Route exact path="/reservations">
            <CurrentReservations 
              username={username} 
              reservations={reservations}
              cancelReservation={cancelReservation}
            />
          </ReactRouterDOM.Route>
        </div>
      </React.Fragment>
    );
  }
  else {
    return <Login setUsername={setUsername} />;
  }
}

ReactDOM.render(
  <ReactRouterDOM.BrowserRouter>
    <App />
  </ReactRouterDOM.BrowserRouter>, 
  document.querySelector('#root'));
