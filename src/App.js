import React, { Component } from 'react';
import MainPanel from './screens/MainPanel';
import {Router,Route} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import AdminHomePanel from './screens/AdminPanel/Home';
import AdminPanel1 from './screens/AdminPanel/Panels/Panel1';
import AdminPanel2 from './screens/AdminPanel/Panels/Panel2';
import AdminPanel3 from './screens/AdminPanel/Panels/Panel3';
import AdminPanel4 from './screens/AdminPanel/Panels/Panel4';

const customHistory=createBrowserHistory();

class App extends Component {

render(){
return(

<Router history={customHistory}>    
<div>
 <Route path='/' exact component={MainPanel} />
<Route path='/adminHomePanel' component={AdminHomePanel} />
<Route path='/panel1/:facultyKey' component={AdminPanel1} />
<Route path='/panel2/:extendYear/:facultyKey' component={AdminPanel2} />
<Route path='/panel3/:semesterKey/:extendYear/:facultyKey' component={AdminPanel3} />
<Route path='/panel4/:courseKey/:semesterKey/:extendYear/:facultyKey' component={AdminPanel4} />
</div>
</Router>
)

}

}

export default App;