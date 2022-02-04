function Login(props) {
  const {setUsername} = props;

  // ReactRouterDOM hook that lets you route without reloading the page and losing parent state
  let history = ReactRouterDOM.useHistory();

  function loginUser(evt) {
    evt.preventDefault();
    setUsername(document.querySelector("#username").value);
    history.push("/schedule"); // Route to schedule page
  }
  return (
    <React.Fragment>
      <h1>Login</h1>
      <form onSubmit={loginUser}>
        Username <input id="username" type="text" name="username" />
        <input type="submit" />
      </form>
    </React.Fragment>
  );
}

function CurrentReservations(props) {
  const reservations = props.reservations;
  const cancelReservation = props.cancelReservation;

  const tableData = [];
  for (const res of reservations) {
    tableData.push(
      <tr>
        <td className="p5">{res.time}</td>
        <td className="p5"><button onClick={() => cancelReservation(res.id)}>Cancel</button></td>
      </tr>);
  }
  console.log(tableData);
  return (
    <React.Fragment>
      <h1>Reservations</h1>
      <div className="col-6">
        <table>
          <tbody>
            {tableData}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}

function AvailableReservations(props) {

  const username = props.username;
  const makeReservation = props.makeReservation;
  const [availableTimes, setAvailableTimes] = React.useState([]);
  
  console.log(username);
  const earliest = new Date().toISOString().substring(0,16);
  
  const getAvailableSlots = (evt) => {
      evt.preventDefault();

      const formData = {
          "startTime": document.querySelector('[name="start_time"]').value,
          "endTime": document.querySelector('[name="end_time"]').value,
          "username": username
      };
  
      const queryString = new URLSearchParams(formData).toString();

      fetch(`/get-available-times?${queryString}`)
        .then(response => response.json())
        .then(response => {
            console.log(response)
            setAvailableTimes(response);
        })
  }

  return (
      <React.Fragment>
          <h1>Schedule a tasting reservation!</h1>
          <form id="schedule" onSubmit={getAvailableSlots}>
              Between: <input type="datetime-local" name="start_time" id="datetime_start" min={earliest} />
              and <input type="datetime-local"  name="end_time" id="datetime_end" min={earliest}/>
              <input type="submit" />
          </form>
          <table>
          <tbody>
            {availableTimes.map((time, index) => {
                return (
                <tr><td><button key={index} onClick={() => makeReservation(time)}>
                    {time}
                </button></td></tr>)
            })}
          </tbody>
          </table>
      </React.Fragment>
  )
}

function Navbar(props) {
  const setUsername = props.setUsername;

  return (
    <nav>
      <section className="d-flex justify-content-center" style={{backgroundColor: 'rgba(255, 255, 255, 0.445)'}}>
        <ReactRouterDOM.NavLink
          to="/schedule"
          activeClassName="navlink-active"
          className="nav-link nav-item"
        >
          Schedule Reservations
        </ReactRouterDOM.NavLink>
        <ReactRouterDOM.NavLink
          to="/reservations"
          activeClassName="navlink-active"
          className="nav-link nav-item"
        >
          Current Reservations
        </ReactRouterDOM.NavLink>
        <ReactRouterDOM.NavLink
          to="/"
          activeClassName="navlink-active"
          className="nav-link nav-item"
          onClick={() => setUsername("")}
        >
          Logout
        </ReactRouterDOM.NavLink>
      </section>
    </nav>
  );
}
